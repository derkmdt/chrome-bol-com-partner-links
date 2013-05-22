var products = {};
var selectedProductUrl = null;
var selectedProductTitle = null;
var selectedId = null;

function updateAddress(tabId) {
  chrome.tabs.sendRequest(tabId, {}, function(product) {
    products[tabId] = product;
    if (!product) {
      chrome.pageAction.hide(tabId);
    } else {
      chrome.pageAction.show(tabId);
      if (selectedId == tabId) {
        updateSelected(tabId);
      }
    }
  });
}

function updateSelected(tabId) {
  selectedProductUrl = products[tabId].url;
  selectedProductTitle = products[tabId].title;
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
    updateAddress(tabId);
  }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
  selectedId = tabId;
  updateSelected(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.getSelected(null, function(tab) {
  updateAddress(tab.id);
});