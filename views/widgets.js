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
      if (result.render === widget.render) {
        // Cache render result only if render() wasn't overridden
        result.__element = result.renderCore();
      }
      return result;
    },
    init: Function.prototype,
    render: function optimizedRenderWidget() {
      return this.__element;
    },
    renderCore: function renderWidget() {
      throw new Error('This function should be implemented in child classes');
    }
  };
  
  function createWidgetKind(properties, baseClass) {
    return Object.assign(Object.create(baseClass || widget), properties);
  }

  //#endregion

  window.widgets = {
    createWidgetKind: createWidgetKind
  };
})();
