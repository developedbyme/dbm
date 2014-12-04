/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.utils.websocket.WebSocketServerFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.utils.websocket.WebSocketServerFunctions");
	//"use strict";
	
	var crypto = require("crypto");
	var url = require("url");
	
	var WebSocketServerFunctions = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketServerFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	staticFunctions.getHandshakeHeaderHybi00 = function(aOrigin, aLocation) {
		var headers = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
			"Upgrade: WebSocket\r\n" +
			"Connection: Upgrade\r\n" +
			"Sec-WebSocket-Origin: " + aOrigin + "\r\n" +
			"Sec-WebSocket-Location: " + aLocation + "\r\n" +
			"\r\n";
		return headers;
	};
	
	staticFunctions.getHandshakeHeaderHybi06 = function(aAcceptKey) {
		var headers = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
			"Upgrade: WebSocket\r\n" +
			"Connection: Upgrade\r\n" +
			"Sec-WebSocket-Accept: " + aAcceptKey + "\r\n" +
			"\r\n";
		return headers;
	};
	
	staticFunctions.getKeyValueHybi00 = function(aKey) {
		
		var dataValue = parseInt(aKey.replace(/[^\d]/g, ""), 10);
		var numberOfSpaces = aKey.replace(/[^ ]/g, "").length;
		
		var encodeValue = dataValue/numberOfSpaces;
		
		return String.fromCharCode((encodeValue >> 24) & 0xFF, (encodeValue >> 16) & 0xFF, (encodeValue >> 8) & 0xFF, (encodeValue) & 0xFF);
	};
	
	staticFunctions.encodeKeyValueHybi06 = function(aKey) {
		//console.log("dbm.nodejs.utils.websocket.WebSocketServerFunctions::encodeKeyValueHybi06");
		var hashGenerator = crypto.createHash("sha1");
		
		//console.log(aKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
		hashGenerator.update(aKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
		
		return hashGenerator.digest("base64");
	};
	
	staticFunctions.getHandshakeResponseHybi00 = function(aKey1, aKey2, aKey3) {
		var md5 = crypto.createHash("md5");
		
		md5.update(ClassReference.getKeyValueHybi00(aKey1));
		md5.update(ClassReference.getKeyValueHybi00(aKey2));
		
		md5.update(aKey3.toString("binary"));
		
		return md5.digest("binary");
	};

	staticFunctions.connectUpgradeHybi00 = function(aRequest, aSocket, aBody, aOrigin, aLocation) {
		console.log("dbm.nodejs.utils.websocket.WebSocketServerFunctions::connectUpgradeHybi00");
		aSocket.setTimeout(0);
		aSocket.setNoDelay(true);
		aSocket.setKeepAlive(true, 0);
		
		var headers = ClassReference.getHandshakeHeaderHybi00(aOrigin, aLocation);
		var handshakeResponse = ClassReference.getHandshakeResponseHybi00(aRequest.headers["sec-websocket-key1"], aRequest.headers["sec-websocket-key2"], aBody);
		
		//console.log(headers + handshakeResponse);
		
		aSocket.write(headers + handshakeResponse, "binary");
	};
	
	staticFunctions.connectUpgradeHybi06 = function(aRequest, aSocket, aBody) {
		console.log("dbm.nodejs.utils.websocket.WebSocketServerFunctions::connectUpgradeHybi06");
		aSocket.setTimeout(0);
		aSocket.setNoDelay(true);
		aSocket.setKeepAlive(true, 0);
		
		var headers = ClassReference.getHandshakeHeaderHybi06(ClassReference.encodeKeyValueHybi06(aRequest.headers["sec-websocket-key"]));
		
		//console.log(headers);
		
		aSocket.write(headers, "utf8");
	};
	
	staticFunctions.connectUpgrade = function(aRequest, aSocket, aBody, aOrigin, aLocation) {
		if(aRequest.headers["sec-websocket-key"] != null) {
			ClassReference.connectUpgradeHybi06(aRequest, aSocket, aBody);
			return 13;
		}
		else {
			ClassReference.connectUpgradeHybi00(aRequest, aSocket, aBody, aOrigin, aLocation);
			return 0;
		}
	};
	
	staticFunctions.getOrigin = function(aRequest) {
		return aRequest.headers["origin"];
	};
	
	staticFunctions.getLocation = function(aRequest, aIsSecure) {
		var host = aRequest.headers["host"];
		
		var returnLocation = (aIsSecure) ? "wss://" : "ws://";
		returnLocation += host;
		
		var parsedUrl = url.parse(aRequest.url);
		
		returnLocation += parsedUrl.pathname;
		returnLocation += parsedUrl.search;
		
		return returnLocation;
	};
	
	staticFunctions.isWebSocketUpgrade = function(aRequest) {
		console.log("dbm.nodejs.utils.websocket.WebSocketServerFunctions::isWebSocketUpgrade");
		var headers = aRequest.headers;
		if(aRequest.method === "GET" && (headers["upgrade"] && headers["connection"])) {
			var connectionTypes = StringFunctions.splitSeparatedString(headers["connection"].toLowerCase(), ",", true, true);
			if(connectionTypes.indexOf("upgrade") !== -1) {
				if(headers["upgrade"].toLowerCase() === "websocket") {
					return true;
				}
			}
		}
		return false;
	};
});