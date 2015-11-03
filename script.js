var TextFinder = (function () {

  var hotKeys = function(e) {
    e = e || window.event;
    //ctrl + shift + f
    if (e.ctrlKey && e.shiftKey && e.keyCode == 70)
      TextFinder.toggleShowSearchPanel();
  };
  var searchInputElement;
  var matchCaseCheckboxElement;
  var wholeWordCheckboxElement;
  var findButtonElement;

  return {

    init: function() {
      TextFinder.drawSearchPanel();
      document.onkeydown = hotKeys;
    },

    insertElementUpward: function(element, callback) {
      var body = document.body;
      body.insertBefore(element, body.firstChild);
      if (callback)
        callback();
    },

    getSearchPanel: function() {
      return document.getElementById('searchPanel');
    },

    getFindOptions: function() {
      return {
        searchText: searchInputElement.value,
        caseSensitive: matchCaseCheckboxElement.checked,
        backwards: null,
        wrapAround: null,
        wholeWord: wholeWordCheckboxElement.checked
      };
    },

    toggleShowSearchPanel: function() {
      var searchPanel = TextFinder.getSearchPanel();
      searchPanel.style.display = (searchPanel.style.display == 'none' ? 'block' : 'none');
    },

    saveElementsLinks: function() {
      findButtonElement = document.getElementById('findButton');
      searchInputElement = document.getElementById('searchInput');
      matchCaseCheckboxElement = document.getElementById('matchCaseCheckbox');
      wholeWordCheckboxElement = document.getElementById('wholeWordCheckbox');
    },

    attachFindEvent: function() {
      var search = function() {
        Search.do(TextFinder.getFindOptions());
      };
      findButton.addEventListener('click', search, false);
    },

    drawSearchPanel: function() {
      //search panel
      var searchPanel = document.createElement('div');
      searchPanel.id = 'searchPanel';

      //search input
      var searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'searchInput';

      //find button
      var findButton = document.createElement('input');
      findButton.type = 'button';
      findButton.id = 'findButton';
      findButton.value = 'Find';
      findButton.style.marginLeft = '10px';

      //checkboxes
      searchPanel.appendChild(searchInput);
      searchPanel.innerHTML += "<input type='checkbox' id='matchCaseCheckbox' style='margin-left: 7px'>" +
        "<label for='matchCaseCheckbox'>match case</label>" +

        "<input type='checkbox' id='wholeWordCheckbox' style='margin-left: 7px'>" +
        "<label for='wholeWordCheckbox'>whole word</label>";
      searchPanel.appendChild(findButton);

      //tip
      var tip = document.createElement('p');
      var tipText = document.createTextNode('press ctrl+shift+f to show/hide search panel');
      tip.appendChild(tipText);
      tip.style.margin = '0';
      tip.style.fontSize = '12px';
      tip.style.color = '#d2d2d2';
      searchPanel.appendChild(tip);

      TextFinder.insertElementUpward(searchPanel, TextFinder.saveElementsLinks);
      TextFinder.attachFindEvent();
    }

  }

})();


var Search = (function() {

  return {

    do: function(findOptions) {
      if (!findOptions.searchText)
        return;

      //not IE browser
      if (window.find && window.getSelection) {

        document.designMode = "on";
        var selection = window.getSelection();
        selection.collapse(document.body, 0);

        while (window.find(findOptions.searchText, findOptions.caseSensitive, false, false, findOptions.wholeWord)) {
          document.execCommand("HiliteColor", false, "yellow");
          selection.collapseToEnd();
        }
        document.designMode = "off";

      //IE browser
      } else if (document.body.createTextRange) {

        var textRange = document.body.createTextRange();
        while (textRange.findText(findOptions.searchText)) {
          textRange.execCommand("BackColor", false, "yellow");
          textRange.collapse(false);
        }

      };

    }

  }

})();


document.addEventListener("DOMContentLoaded", function() {
  TextFinder.init();
});
