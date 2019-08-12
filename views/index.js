(function(window, document) {
  'use strict';

  const surface = document.getElementById('surface');

  function resizeSurface() {
    surface.width = window.innerWidth;
    surface.height = window.innerHeight;
  }

  resizeSurface();
  window.addEventListener('resize', resizeSurface);

  const Painter = require('./scripts/painter');
  new Painter(surface);
})(window, document);
