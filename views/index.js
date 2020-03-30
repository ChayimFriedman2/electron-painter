const surface = /** @type {HTMLCanvasElement} */ (document.getElementById('surface'));

function resizeSurface() {
  surface.width = window.innerWidth;
  surface.height = window.innerHeight;
}

resizeSurface();
window.addEventListener('resize', resizeSurface);

/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} Size
 * @property {number} x
 * @property {number} y
 */

 /**
  * @typedef {string} Color
  */

