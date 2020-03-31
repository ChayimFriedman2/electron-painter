(function() {
  var HANDLE_SIZE = 6, HANDLE_DRAG_DISTANCE = 30;
  var HANDLES_CURSORS_MAP = {
    top: 'ns-resize', bottom: 'ns-resize',
    left: 'ew-resize', right: 'ew-resize',
    'top-left': 'nwse-resize', 'bottom-right': 'nwse-resize',
    'top-right': 'nesw-resize', 'bottom-left': 'nesw-resize',
    center: 'move'
  };

  // eslint-disable-next-line no-extra-parens
  var surface = /** @type {HTMLCanvasElement} */ (window.surface);
  var ctx = surface.getContext('2d');

  var shapeToPersist = null;
  
  var draggedBoundaryHandle = null;
  /**
   * The distance from the mouse pointer to the center of the dragging handle, at the beginning of the drag.
   */
  var draggedBoundaryHandleDistance = null;

  var currentlyDrawnShape = null;
  var currentlyDrawnShapeStartPosition = null;

  function strokeFillRect(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
  }

  //#region Rectangle Positions Utilities

  function topLeftCorner(rect) {
    return { x: rect.x, y: rect.y };
  }

  function topRightCorner(rect) {
    return { x: rect.x + rect.width, y: rect.y };
  }

  function bottomLeftCorner(rect) {
    return { x: rect.x, y: rect.y + rect.height };
  }

  function bottomRightCorner(rect) {
    return { x: rect.x + rect.width, y: rect.y + rect.height };
  }

  function topMiddle(rect) {
    return { x: rect.x + (rect.width / 2), y: rect.y };
  }

  function bottomMiddle(rect) {
    return { x: rect.x + (rect.width / 2), y: rect.y + rect.height };
  }

  function leftMiddle(rect) {
    return { x: rect.x, y: rect.y + (rect.height / 2) };
  }

  function rightMiddle(rect) {
    return { x: rect.x + rect.width, y: rect.y + (rect.height / 2) };
  }

  //#endregion

  function isInsideRect(point, rect) {
    return rect.x <= point.x && point.x <= (rect.x + rect.width) &&
      rect.y <= point.y && point.y <= (rect.y + rect.height);
  }

  function squareFromCenter(center, edgeSize) {
    return {
      x: center.x - (edgeSize / 2),
      y: center.y - (edgeSize / 2),
      width: edgeSize,
      height: edgeSize
    };
  }

  function twoPointsRect(a, b) {
    var minX = Math.min(a.x, b.x), minY = Math.min(a.y, b.y),
      maxX = Math.max(a.x, b.x), maxY = Math.max(a.y, b.y);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Draws a dashed line.
   * @param {number[]} dashStyle The dash style. Same type as `CanvasRenderingContext2D.setLineDash()` parameter.
   * @param {typeof ctx.strokeStyle} normalColor The color to draw the second dashed part with.
   * @param {typeof ctx.strokeStyle} dashedColor The color to draw the first dashed part with.
   * @param {() => void} drawCallback Callback to actually draw the lines after the preparations.
   */
  function strokeDashed(dashStyle, normalColor, dashedColor, drawCallback) {
    ctx.save();
    ctx.strokeStyle = normalColor;
    drawCallback();
    ctx.strokeStyle = dashedColor;
    ctx.setLineDash(dashStyle);
    drawCallback();
    ctx.restore();
  }

  function drawBoundaries(boundaries) {
    ctx.save();

    ctx.lineWidth = 2;
    strokeDashed([3], 'white', 'blue',
      ctx.strokeRect.bind(ctx, boundaries.x, boundaries.y, boundaries.width, boundaries.height));

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'blue';
    function drawHandle(at) {
      strokeFillRect(at.x - (HANDLE_SIZE / 2), at.y - (HANDLE_SIZE / 2), HANDLE_SIZE, HANDLE_SIZE);
    }
    // Corners
    drawHandle(topLeftCorner(boundaries));
    drawHandle(topRightCorner(boundaries));
    drawHandle(bottomLeftCorner(boundaries));
    drawHandle(bottomRightCorner(boundaries));
    // Middles
    drawHandle(topMiddle(boundaries));
    drawHandle(bottomMiddle(boundaries));
    drawHandle(leftMiddle(boundaries));
    drawHandle(rightMiddle(boundaries));
    
    ctx.restore();
  }

  function boundaryHandleAt(boundaries, at) {
    // Corners
    if (isInsideRect(at, squareFromCenter(topLeftCorner(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'top-left',
        handleCenter: topLeftCorner(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(topRightCorner(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'top-right',
        handleCenter: topRightCorner(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(bottomLeftCorner(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'bottom-left',
        handleCenter: bottomLeftCorner(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(bottomRightCorner(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'bottom-right',
        handleCenter: bottomRightCorner(boundaries)
      };
    } else
    // Middles
    if (isInsideRect(at, squareFromCenter(topMiddle(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'top',
        handleCenter: topMiddle(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(bottomMiddle(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'bottom',
        handleCenter: bottomMiddle(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(leftMiddle(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'left',
        handleCenter: leftMiddle(boundaries)
      };
    } else if (isInsideRect(at, squareFromCenter(rightMiddle(boundaries), HANDLE_DRAG_DISTANCE))) {
      return {
        onBoundaries: true,
        handle: 'right',
        handleCenter: rightMiddle(boundaries)
      };
    } else
    // Inside
    if (isInsideRect(at, boundaries)) {
      return {
        onBoundaries: true,
        handle: 'center',
        handleCenter: topLeftCorner(boundaries) // Because the boundaries are calculated from the top-left corner
      };
    } else {
      return {
        onBoundaries: false
      };
    }
  }

  function startDrawingNewShape(at) {
    currentlyDrawnShapeStartPosition = at;
    currentlyDrawnShape = window.shapes.newOfCurrentType(at);
  }

  surface.addEventListener('mousedown', function onMouseDown(e) {
    if (shapeToPersist) {
      var draggedBoundary = boundaryHandleAt(shapeToPersist.getBoundaries(), { x: e.clientX, y: e.clientY });
      if (!draggedBoundary.onBoundaries) {
        draggedBoundaryHandle = null;
        window.painter.persist(shapeToPersist);
        shapeToPersist = null;

        startDrawingNewShape({ x: e.clientX, y: e.clientY });
      } else {
        draggedBoundaryHandle = draggedBoundary.handle;
        draggedBoundaryHandleDistance = {
          x: e.clientX - draggedBoundary.handleCenter.x,
          y: e.clientY - draggedBoundary.handleCenter.y
        };
      }
    } else {
      startDrawingNewShape({ x: e.clientX, y: e.clientY });
    }
  }, false);
  surface.addEventListener('mousemove', function onMouseMove(e) {
    if (draggedBoundaryHandle) {
      var boundaries = shapeToPersist.getBoundaries();
      
      var ensureTop = function ensureTop() { return e.clientY < (boundaries.y + boundaries.height); };
      var ensureBottom = function ensureBottom() { return e.clientY > boundaries.y; };
      var ensureLeft = function ensureLeft() { return e.clientX < (boundaries.x + boundaries.width); };
      var ensureRight = function ensureRight() { return e.clientX > boundaries.x; };

      var setTop = function setTop() {
        if (ensureTop()) {
          boundaries.height += boundaries.y - (e.clientY - draggedBoundaryHandleDistance.y);
          boundaries.y = e.clientY - draggedBoundaryHandleDistance.y;
        }
      };
      var setBottom = function setBottom() {
        if (ensureBottom()) {
          boundaries.height = e.clientY - (boundaries.y - draggedBoundaryHandleDistance.y);
        }
      };
      var setLeft = function setLeft() {
        if (ensureLeft()) {
          boundaries.width += boundaries.x - (e.clientX - draggedBoundaryHandleDistance.x);
          boundaries.x = e.clientX - draggedBoundaryHandleDistance.x;
        }
      };
      var setRight = function setRight() {
        if (ensureRight()) {
          boundaries.width = e.clientX - (boundaries.x - draggedBoundaryHandleDistance.x);
        }
      };
      
      switch (draggedBoundaryHandle) {
        case 'top':
          setTop();
          break;
        case 'bottom':
          setBottom();
          break;
        case 'left':
          setLeft();
          break;
        case 'right':
          setRight();
          break;
          
        case 'top-left':
          setTop();
          setLeft();
          break;
        case 'top-right':
          setTop();
          setRight();
          break;
        case 'bottom-left':
          setBottom();
          setLeft();
          break;
        case 'bottom-right':
          setBottom();
          setRight();
          break;

        case 'center':
          boundaries.x = e.clientX - draggedBoundaryHandleDistance.x;
          boundaries.y = e.clientY - draggedBoundaryHandleDistance.y;
          break;
      }
      shapeToPersist.setBoundaries(boundaries);
      window.painter.draw(shapeToPersist);
      drawBoundaries(boundaries);
    } else if (currentlyDrawnShape) {
      currentlyDrawnShape.setBoundaries(
        twoPointsRect({ x: e.clientX, y: e.clientY }, currentlyDrawnShapeStartPosition));
      window.painter.draw(currentlyDrawnShape);
    } else if (shapeToPersist) {
      var hoverBoundary = boundaryHandleAt(shapeToPersist.getBoundaries(), { x: e.clientX, y: e.clientY });
      surface.style.cursor = hoverBoundary.onBoundaries ? HANDLES_CURSORS_MAP[hoverBoundary.handle] : 'default';
    }
  }, false);
  surface.addEventListener('mouseup', function onMouseUp() {
    if (currentlyDrawnShape) {
      var boundaries = currentlyDrawnShape.getBoundaries();
      if (boundaries.width > 0 && boundaries.height > 0) {
        shapeToPersist = currentlyDrawnShape;
        window.painter.draw(shapeToPersist);
        drawBoundaries(boundaries);
      }
      currentlyDrawnShape = null;
      currentlyDrawnShapeStartPosition = null;
    }

    draggedBoundaryHandle = null;
  }, false);
})();
