/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.MimeTypeFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.MimeTypeFunctions");
	
	var MimeTypeFunctions = dbm.importClass("dbm.utils.file.MimeTypeFunctions");
	
	staticFunctions.getFileExtensionForMimeType = function(aMimeType) {
		//console.log("dbm.utils.file.MimeTypeFunctions::getFileExtensionForMimeType");
		if(aMimeType === null) {
			//METODO: error message
			return null;
		}
		
		var mimeType = aMimeType;
		var semiColonPosition = aMimeType.indexOf(";");
		if(semiColonPosition !== -1) {
			mimeType = aMimeType.substring(0, semiColonPosition);
		}
		
		//console.log(mimeType);
		switch(mimeType.toLowerCase()) {
			case "video/mp4":
				return "mp4";
			case "video/ogg":
				return "ogv";
			case "video/webm":
				return "webm";
			case "audio/mpeg":
				return "mp3";
			case "audio/ogg":
				return "oga";
		}
		//METODO: error message
		return null;
	};
	
	staticFunctions.getMimeTypeForFileExtension = function(aExtension) {
		switch(aExtension.toLowerCase()) {
			case "mp4":
				return "video/mp4";
			case "ogv":
				return "video/ogg";
			case "webm":
				return "video/webm";
			case "mp3":
				return "audio/mpeg";
			case "oga":
				return "audio/ogg";
		}
		//METODO: error message
		return null;
	};
});