(function() {
  // eslint-disable-next-line no-extra-parens
  var surface = /** @type {HTMLCanvasElement} */ (document.getElementById('surface'));
  var persistentCanvas = document.createElement('canvas');
  
  var surfaceBackup = document.createElement('canvas');
  var persistentCanvasBackup = document.createElement('canvas');
  var surfaceCtx = surface.getContext('2d'),
    persistentCanvasCtx = persistentCanvas.getContext('2d'),
    surfaceBackupCtx = surfaceBackup.getContext('2d'),
    persistentCanvasBackupCtx = persistentCanvasBackup.getContext('2d');

  function backupOne(sourceCtx, backupCtx) {
    backupCtx.canvas.width = sourceCtx.canvas.width;
    backupCtx.canvas.height = sourceCtx.canvas.height;
    backupCtx.drawImage(sourceCtx.canvas, 0, 0, sourceCtx.canvas.width, sourceCtx.canvas.height);
  }

  function restoreOneFromBackup(sourceCtx, backupCtx) {
    sourceCtx.drawImage(backupCtx.canvas, 0, 0, backupCtx.canvas.width, backupCtx.canvas.height);
  }

  function backup() {
    backupOne(surfaceCtx, surfaceBackupCtx);
    backupOne(persistentCanvasCtx, persistentCanvasBackupCtx);
  }

  function restoreFromBackups() {
    restoreOneFromBackup(surfaceCtx, surfaceBackupCtx);
    restoreOneFromBackup(persistentCanvasCtx, persistentCanvasBackupCtx); 
  }

  function resizeSurface() {
    backup();

    surface.width = persistentCanvas.width = window.innerWidth;
    surface.height = persistentCanvas.height = window.innerHeight;

    restoreFromBackups();
  }

  resizeSurface();
  window.addEventListener('resize', resizeSurface);

  window.surface = surface;
  window.persistentCanvas = persistentCanvas;
})();
