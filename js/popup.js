function getProduct() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.extension.getBackgroundPage().getProductData(tab, function(data){
			console.log('data',data);
			var producturl = data.product.url;
			var producttitle = encodeURIComponent($.trim(data.product.title.split("|")[1])).toLowerCase();
			var partnerurl = 'http://partnerprogramma.bol.com/click/click?p=1&t=url&s='+localStorage["bol_com_siteid"]+'&url='+producturl+'&f=API&subid='+encodeURIComponent(localStorage["bol_com_subid"])+'&name='+producttitle;
			$('#content_text').attr('title', 'Originele url: '+partnerurl);
			getShortUrl(partnerurl, function(urldata) {
				var removesiteid = '<div id="removesiteid"><small title="Verwijder je partnerprogramma siteid">Verander siteid</small></div><div id="addsubid">&nbsp;-&nbsp;<small title="Verander het partnerprogramma subid">Verander subid</small></div>';
				if (partnerurl) {
					$('#content_text').html('Shorturl voor dit product is naar klembord gekopieerd:<br><span class="bollink">'+urldata+'</span><br>'+removesiteid);
					$('#content_logo').show();
					copyToClipboard(urldata);
					$('.bollink').attr('tabindex', 1);
				}
				$('#removesiteid').click(function () {
					remove_siteid();
				});
				$('#addsubid').click(function () {
					add_subid();
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
		});
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
	var url = longUrl;
	$.ajax({
		url : "https://labs.bol.com/shorturl/",
		dataType : 'jsonp',
		type : "GET",
		data : { url : url },
		success : function(data) {
			if(data.statusCode === "OK"){
				var shortUrl = '';
				var first_result;
				for (var r in data.results) {
					first_result = data.results[r]; break;
				}
				shortUrl = first_result.shortUrl;
				callback(shortUrl);
			}
		},
			error : function(xhr, error, message) {
			console.log(error);
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
		$('#content_text').html('<div class="clearer"></div><div>Plaats eerst je partnerprogramma siteid:<br><input type="text" id="siteid"></div><div class="buttonblock"><button type="submit" id="sendbutton">Versturen</button></div>');
		$('#content_logo').show();
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

function set_subid() {
	if($('#subid').val() != "") {
		localStorage["bol_com_subid"] = $('#subid').val();
		getProduct();
	}
}

function remove_siteid() {
	localStorage.removeItem("bol_com_siteid");
	run();
}

function add_subid() {
	$('#content_text').append('<div class="clearer"></div><div class="textblock">Voeg hier je gewenste subid toe:<br><input type="text" id="subid"></div><div class="buttonblock"><button type="submit" id="sendbutton">Versturen</button></div>');
	$('#sendbutton').click(set_subid);
}

window.onload = run;