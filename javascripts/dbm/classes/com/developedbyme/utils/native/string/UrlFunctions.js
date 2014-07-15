/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.string.UrlFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.UrlFunctions");
	//"use strict";
	
	//Self reference
	var UrlFunctions = dbm.importClass("com.developedbyme.utils.native.string.UrlFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.parseQueryString = function(aQueryString, aReturnNamedArray) {
		var currentArray = aQueryString.split("&");
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var tempArray = currentArray[i].split("=");
			if(tempArray.length === 1) {
				aReturnNamedArray.addObject(decodeURIComponent(tempArray[0]), null);
			}
			else {
				aReturnNamedArray.addObject(decodeURIComponent(tempArray[0]), decodeURIComponent(tempArray[1]));
			}
		}
	};
	
	staticFunctions.getDataFromDataUrl = function(aDataUrl) {
		return aDataUrl.substring(aDataUrl.indexOf(",")+1, aDataUrl.length);
	};
});
