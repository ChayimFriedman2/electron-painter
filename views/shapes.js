(function() {
  var currentType = null;

  var baseShape = {
    init: function init(at) {
      this.boundaries = { x: at.x, y: at.y, width: 0, height: 0 };
    },
    getBoundaries: function getBoundaries() { return this.boundaries; },
    setBoundaries: function setBoundaries(boundaries) { this.boundaries = boundaries; }
  };

  function newShapeType(draw) {
    var result = Object.create(baseShape);
    result.draw = draw;
    return result;
  }

  var shapeTypes = [
    newShapeType(function drawRect(/** @type {CanvasRenderingContext2D} */ ctx) {
      ctx.strokeRect(this.boundaries.x, this.boundaries.y, this.boundaries.width, this.boundaries.height);
    })
  ];
  currentType = shapeTypes[0];

  window.shapes = {
    newOfCurrentType: function newOfCurrentType(at) {
      var result = Object.create(currentType);
      result.init(at);
      return result;
    }
  };
})();
