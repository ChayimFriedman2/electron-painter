(function() {
  //#region Utilities

  // See https://stackoverflow.com/a/3955238/7884305.
  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  }

  //#endregion

  //#region Tab Management

  var toolbarElement = document.createElement('div');
  toolbarElement.className = 'toolbar';
  var tabsView = document.createElement('div');
  tabsView.className = 'tabs-line';
  toolbarElement.appendChild(tabsView);
  var currentTab = document.createElement('div');
  currentTab.className = 'current-tab';
  toolbarElement.appendChild(currentTab);

  var activeTab = 'Home';

  function addTab(text, className, activatable, callback, onActivate) {
    activatable = activatable === undefined ? true : activatable;
    var element = document.createElement('div');
    element.className = className ? 'tab ' + className : 'tab';
    element.textContent = text;
    tabsView.appendChild(element);
    if (activatable) {
      element.addEventListener('mousedown', function() {
        if (activeTab !== text) {
          activeTab = text;
          tabsView.childNodes.forEach(function(tab) {
            if (tab === element) {
              tab.classList.add('active');
            } else {
              tab.classList.remove('active');
            }
          });
        }

        if (onActivate) {
          onActivate();
        }
      }, false); 
    }
    if (callback) {
      callback(element);
    }
  }

  document.body.appendChild(toolbarElement);

  //#endregion Tab Management

  //#region File Menu

  //#region Elements Creation

  var fileMenu = document.createElement('div');
  fileMenu.className = 'file-menu';
  toolbarElement.appendChild(fileMenu);
  var fileActionsContainer = document.createElement('div');
  fileActionsContainer.className = 'file-menu-actions';
  fileMenu.appendChild(fileActionsContainer);
  var recentFilesList = document.createElement('div');
  recentFilesList.className = 'file-menu-recent';
  fileMenu.appendChild(recentFilesList);
  var fileMenuTab;

  //#endregion

  //#region Subactions Management

  function showRecentFiles() {
    // TODO
  }

  //#endregion

  //#region Menu Registration

  fileMenu.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  function hideFileMenu() {
    fileMenu.classList.remove('visible');
    fileMenuTab.classList.remove('visible');
  }

  addTab('File', 'file', false, function(tabElement) {
    fileMenuTab = tabElement;

    document.addEventListener('mousedown', hideFileMenu, false);

    fileMenuTab.addEventListener('mousedown', function(e) {
      e.stopPropagation();

      showRecentFiles();

      fileMenu.classList.toggle('visible');
      fileMenuTab.classList.toggle('visible');
    });
  });

  //#endregion

  //#region File Menu Commands Management

  var fileItems = [];
  var fileMenuSeparator = document.createElement('div');
  fileMenuSeparator.className = 'file-menu-separator';
  function rerenderFileMenu() {
    clearChildren(fileActionsContainer);

    fileItems.forEach(function(item) {
      if (item === 'separator') {
        var fileMenuSeparator = document.createElement('div');
        fileMenuSeparator.className = 'file-menu-separator';
        fileActionsContainer.appendChild(fileMenuSeparator);
      } else if (item) {
        var action = document.createElement('div');
        action.className = 'file-menu-action';

        var icon;
        if (item.icon) {
          icon = document.createElement('img');
          icon.src = item.icon;
        } else {
          icon = document.createElement('div');
        }
        icon.className = 'file-menu-action-icon';
        action.appendChild(icon);
        
        var text = document.createElement('div');
        text.textContent = item.caption;
        text.className = 'file-menu-action-text';
        action.appendChild(text);

        if (item.showSubactions) {
          var expandArrow = document.createElement('div');
          expandArrow.className = 'file-menu-action-expand-subactions-arrow';
          expandArrow.addEventListener('click', function(e) {
            e.stopPropagation(); // Do not trigger default action when clicked on arrow
          }, false);
          expandArrow.addEventListener('mouseenter', function() { action.classList.add('expand-arrow-hover'); }, false);
          expandArrow.addEventListener('mouseleave', function() { action.classList.remove('expand-arrow-hover'); }, false);
          action.appendChild(expandArrow);

          action.addEventListener('mouseenter', item.showSubactions.bind(item), false);
        } else {
          action.addEventListener('mouseenter', showRecentFiles, false);
        }

        action.addEventListener('click', function() {
          hideFileMenu();
          item.onClick();
        }, false);

        fileActionsContainer.appendChild(action);
      }
    });
  }

  //#endregion
  
  //#endregion

  addTab('Home', 'active');
  addTab('View');

  window.toolbar = {
    addFileAction: function addFileAction(action, index) {
      fileItems[index] = action;
      rerenderFileMenu();
    },
    addFileSeparator: function addFileSeparator(index) {
      fileItems[index] = 'separator';
      rerenderFileMenu();
    }
  };

  window.toolbar.addFileAction({
    icon: 'icons/new-file.svg',
    caption: 'New',
    onClick: Function.prototype
  }, 0);
  window.toolbar.addFileAction({
    icon: 'icons/open-file.svg',
    caption: 'Open',
    onClick: Function.prototype
  }, 1);
  window.toolbar.addFileAction({
    icon: 'icons/save-file.svg',
    caption: 'Save',
    onClick: Function.prototype
  }, 2);
  window.toolbar.addFileAction({
    icon: 'icons/save-file.svg',
    caption: 'Save as',
    onClick: Function.prototype,
    showSubactions: Function.prototype
  }, 3);
  window.toolbar.addFileSeparator(4);
  window.toolbar.addFileAction({
    icon: 'icons/print.svg',
    caption: 'Print',
    onClick: Function.prototype
  }, 5);
})();
