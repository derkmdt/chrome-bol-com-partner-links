chrome.tabs.onUpdated.addListener(function( tabId , info, tab ) {
    if ( info.status == "complete" ) {
       	getProductData(tab, function(data) {
	       	console.log('data.product',data.product.url);
			if (data.product.url == '') {
				chrome.pageAction.hide(tabId);
			} else {
				chrome.pageAction.show(tabId);
			}
       	});
	}
});
var getProductData = function(tab, callback) {
	if(!tab) return;
	var isSubdomain = function(url) {
		var regex = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
		return url.match(regex) ? true : false;
	}
	var protocol =  tab.url.match(/^(.[^:]+):/)[1];
	if(protocol == "https" || protocol == "http" || (tab.url.indexOf("bol.com") != -1 && !isSubdomain(tab.url)) ) {
		chrome.tabs.sendMessage(tab.id, {url: "getPRODUCT", taburl: tab.url}, function(response) {
			console.log('getPRODUCT',response);
			if(response) callback(response); else callback();
		});
	} else {
		return;
	}
};