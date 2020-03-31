(function() {
  // eslint-disable-next-line no-extra-parens
  var surface = /** @type {HTMLCanvasElement} */ (window.surface);
  // eslint-disable-next-line no-extra-parens
  var persistentCanvas = /** @type {HTMLCanvasElement} */ (window.persistentCanvas);
  var ctx = surface.getContext('2d');
  var persistentCtx = persistentCanvas.getContext('2d');

  function drawOnSurface() {
    ctx.clearRect(0, 0, surface.width, surface.height);
    ctx.drawImage(persistentCanvas, 0, 0, surface.width, surface.height);
  }

  function drawShape(ctx, shape) {
    ctx.save();
    ctx.strokeStyle = window.colors.regular;
    ctx.lineWidth = window.thickness;
    shape.draw(ctx);
    ctx.restore();
  }

  window.painter = {
    draw: function draw(shape) {
      drawOnSurface();
      drawShape(ctx, shape);
    },
    persist: function persist(shape) {
      drawShape(persistentCtx, shape);
      drawOnSurface();
    },
    eraserSize: 5,
    erase: function erase(at) {
      ctx.save();
      ctx.fillStyle = window.colors.erasure;
      persistentCtx.fillRect(at.x - (this.eraserSize / 2), at.y - (this.eraserSize / 2),
        this.eraserSize, this.eraserSize);
      ctx.restore();
      drawOnSurface();
    },
    fill: function fill(at) {
      window.floodFill.fill(at.x, at.y, 0, persistentCtx);
      drawOnSurface();
    }
  };
})();
