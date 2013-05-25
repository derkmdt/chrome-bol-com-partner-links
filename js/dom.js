chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.url == 'getPRODUCT') {
		if(location.href.indexOf("bol.com") != "-1") { // && location.href.indexOf("\/p\/") != "-1"
			var product = new Object();
			product.url = location.href.split("?")[0];
			product.title = document.title;
			sendResponse( {product: product} );
		} else {
			sendResponse({});
		}
	}
});