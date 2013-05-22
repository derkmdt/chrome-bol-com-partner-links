// The background page is asking us to find an address on the page.
if (window == top) {
  chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
    sendResponse(getProductUrl());
  });
}

// Called when the url of a tab changes.
function getProductUrl() {
	if(location.href.indexOf("bol.com") != "-1" && location.href.indexOf("\/p\/") != "-1") {
		var product = new Object();
		product.url = location.href.split("?")[0];
		product.title = document.title;
		return product;
	}
}