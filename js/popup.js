function getProduct() {
	var producturl = chrome.extension.getBackgroundPage().selectedProductUrl;
	var producttitle = $.trim(chrome.extension.getBackgroundPage().selectedProductTitle.split("|")[1]);
	var partnerurl = 'http://partnerprogramma.bol.com/click/click?p=1&t=url&s='+localStorage["bol_com_siteid"]+'&url='+producturl+'&f=API&subid=[id]&name='+producttitle;
	$('#content_text').attr('title', 'Originele url: '+partnerurl);
	getShortUrl(partnerurl, function(urldata) {
		var removesiteid = '<div id="removesiteid"><small title="Verwijder je partnerprogramma siteid">Verwijder siteid</small></div>';
		if (partnerurl) {
			$('#content_text').html('Shorturl voor dit product is naar klembord gekopieerd:<br><span class="bollink">'+urldata+'</span>'+removesiteid);
			copyToClipboard(urldata);
			$('.bollink').attr('tabindex', 1);
		}
		$('#removesiteid').click(function () {
			remove_siteid();
		});
		$('#content_close').show();
		$('#content_close').click(function () {
			window.close();
		});
		$('#content_block').width(450);
		/*
		setTimeout(function() {
			window.close();
		}, 10000);
		*/
	});
}

function copyToClipboard(text) {
	var copyDiv = document.createElement('div');
	copyDiv.contentEditable = true;
	document.body.appendChild(copyDiv);
	copyDiv.innerHTML = text;
	copyDiv.unselectable = "off";
	copyDiv.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.body.removeChild(copyDiv);
}

function getShortUrl(longUrl, callback) {
	var url = escape(longUrl);
	$.ajax({
		url : "https://www.404design.nl/bitly/",
		dataType : 'jsonp',
		type : "GET",
		data : { url : url },
		success : function(data) {
			if(data.status_txt === "OK"){
				var shortUrl = data.data.url;
				callback(shortUrl);
			}
		},
			error : function(xhr, error, message) {
			//no success, fallback to the long url
			var shortUrl = unescape(url);
			callback(shortUrl);
		}
	});
}

function run() {
	var siteid = localStorage["bol_com_siteid"];
	if(typeof siteid == 'undefined') {
		$('#content_close').show();
		$('#content_close').click(function () {
			window.close();
		});
		$('#content_block').width(450);
		$('#content_text').html('Plaats eerst je partnerprogramma siteid:<br><input type="text" id="siteid"><button type="submit" id="sendbutton">Versturen</button>');
		$('#sendbutton').click(set_siteid);
		$('#siteid').attr('tabindex', 1);
	} else {
		getProduct();
	}
}

function set_siteid() {
	if($('#siteid').val() != "") {
		localStorage["bol_com_siteid"] = $('#siteid').val();
		getProduct();
	}
}

function remove_siteid() {
	localStorage.removeItem("bol_com_siteid");
	run();
}

window.onload = run;