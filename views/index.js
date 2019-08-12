(function(window, document) {
  'use strict';

  const surface = document.getElementById('surface');

  function resizeSurface() {
    surface.width = window.innerWidth;
    surface.height = window.innerHeight;
  }

  resizeSurface();
  window.addEventListener('resize', resizeSurface);
})(window, document);
