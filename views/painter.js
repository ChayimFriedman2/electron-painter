(function(window, document) {
  var surface = /** @type {HTMLCanvasElement} */ (window.surface);
  var persistentCanvas = /** @type {HTMLCanvasElement} */ (window.persistentCanvas);
  var ctx = surface.getContext('2d');
  var persistentCtx = persistentCanvas.getContext('2d');

  window.painter = {
    draw: function draw(shape) {
      ctx.drawImage(persistentCtx, 0, 0, surface.width, surface.height);
      if (shape) {
        ctx.save();
        shape.draw(ctx, window.colors.regular);
        ctx.restore();
      }
    },
    persist: function persist(shape) {
      shape.draw(persistentCtx, window.colors.regular);
      this.draw();
    },
    eraserSize: 5,
    erase: function erase(at) {
      ctx.save();
      ctx.fillStyle = window.colors.erasure;
      persistentCtx.fillRect(at.x - (this.eraserSize / 2), at.y - (this.eraserSize / 2),
        this.eraserSize, this.eraserSize);
      ctx.restore();
      this.draw();
    },
    fill: function fill(at) {
      floodFill.fill(at.x, at.y, 0, persistentCtx);
      this.draw();
    }
  };
})(window, document);
