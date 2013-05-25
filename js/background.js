chrome.tabs.onUpdated.addListener(function( tabId , info, tab ) {
    if ( info.status == "complete" ) {
       	getProductData(tab, function(data) {
			if (!data) {
				chrome.pageAction.hide(tabId);
			} else {
				chrome.pageAction.show(tabId);
			}
       	});
	}
});
var getProductData = function(tab, callback) {
	if(!tab) return;
	var protocol =  tab.url.match(/^(.[^:]+):/)[1];
	if(protocol == "https" || protocol == "http") {
		chrome.tabs.sendMessage(tab.id, {url: "getPRODUCT",taburl: tab.url}, function(response) {
			callback(response);
		});
	};
};