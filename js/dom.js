chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	if(request.url == 'getPRODUCT') {
		var isSubdomain = function(url) {
			var regex = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
			return url.match(regex) ? true : false;
		}
		var product = new Object();
		if(location.href.indexOf("bol.com") != -1 && !isSubdomain(location.href)) {
			product.url = (document.querySelector('link[rel="canonical"]')) ? document.querySelector('link[rel="canonical"]').href : location.href.split("?")[0];
			product.title = document.title;
			sendResponse( {product: product} );
		} else {
			product.url = '';
			sendResponse({product: product});
		}
	}
});