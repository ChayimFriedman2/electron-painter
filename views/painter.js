(function(window, document) {
  const ctx = /** @type {CanvasRenderingContext2D} */ (window.surface.getContext('2d'));
  const persistentCtx = /** @type {CanvasRenderingContext2D} */ (window.persistentCanvas.getContext('2d'));

  window.painter = {
    draw: function draw(shape) {
      ctx.drawImage(persistentCtx, 0, 0, ctx.canvas.width, ctx.canvas.height);
      if (shape) {
        shape.draw(ctx, window.colors.regular);
      }
    },
    persist: function persist(shape) {
      shape.draw(persistentCtx, window.colors.regular);
      this.draw();
    }
  };
})(window, document);
