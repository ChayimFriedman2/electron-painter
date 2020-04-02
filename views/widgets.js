(function() {
  //#region Polyfills

  Object.assign = Object.assign || function(target) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < sources.length; i++) {
      for (var property in sources[i]) {
        target[property] = sources[i][property];
      }
    }
    return target;
  };

  //#endregion

  //#region Base Widget

  var widget = {
    create: function createWidget() {
      var result = Object.create(this);
      result.init.apply(result, arguments);
      return result;
    },
    init: Function.prototype,
    render: function renderWidget() {
      throw new Error('This function must be implemented in child classes');
    }
  };
  
  function createWidgetKind(properties) {
    return Object.assign(Object.create(widget), properties);
  }

  //#endregion

  window.widgets = {
    createWidgetKind: createWidgetKind
  };
})();
