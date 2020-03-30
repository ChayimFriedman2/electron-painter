(function(window, document) {
  const ctx = /** @type {CanvasRenderingContext2D} */ (window.surface.getContext('2d'));
  const persistentCtx = /** @type {CanvasRenderingContext2D} */ (window.persistentCanvas.getContext('2d'));

  window.Painter = {
    draw: function draw(shape) {
      ctx.drawImage(persistentCtx, 0, 0, ctx.canvas.width, ctx.canvas.height);
      shape.draw(ctx);
    },
    persist: function persist(shape) {
      shape.draw(persistentCtx);
      this.draw();
    }
  };
})(window, document);
