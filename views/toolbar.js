(function() {
  var toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  var tabsView = document.createElement('div');
  tabsView.className = 'tabs-line';
  toolbar.appendChild(tabsView);
  var currentTab = document.createElement('div');
  currentTab.className = 'current-tab';
  toolbar.appendChild(currentTab);

  var activeTab = 'Home';

  function addTab(onView, text, className) {
    var element = document.createElement('div');
    element.className = className ? 'tab ' + className : 'tab';
    element.textContent = text;
    tabsView.appendChild(element);
    element.addEventListener('click', function() {
      if (activeTab !== text) {
        activeTab = text;
        tabsView.childNodes.forEach(function(tab) {
          if (tab === element) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
        onView();
      }
    }, false);
  }

  addTab(Function.prototype, 'File', 'file');
  addTab(Function.prototype, 'Home', 'active');
  addTab(Function.prototype, 'View');

  document.body.appendChild(toolbar);
})();
