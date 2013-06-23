chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.url == 'getPRODUCT') {
		var isSubdomain = function(url) {
			var regex = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
			return url.match(regex) ? true : false;
		}
		if(location.href.indexOf("bol.com") != -1 && !isSubdomain(location.href)) { // && location.href.indexOf("\/p\/") != "-1"
			var product = new Object();
			product.url = location.href.split("?")[0];
			product.title = document.title;
			sendResponse( {product: product} );
		} else {
			sendResponse({});
		}
	}
});