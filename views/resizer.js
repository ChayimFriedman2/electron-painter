(function(window, document) {
  const surface = /** @type {HTMLCanvasElement} */ (document.getElementById('surface'));
  const persistentCanvas = document.createElement('canvas');

  function resizeSurface() {
    surface.width = persistentCanvas.width = window.innerWidth;
    surface.height = persistentCanvas.height = window.innerHeight;
  }

  resizeSurface();
  window.addEventListener('resize', resizeSurface);

  window.surface = surface;
  window.persistentCanvas = persistentCanvas;
})(window, document);
