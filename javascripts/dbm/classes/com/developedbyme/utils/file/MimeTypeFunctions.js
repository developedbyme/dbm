dbm.registerClass("com.developedbyme.utils.file.MimeTypeFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.MimeTypeFunctions");
	
	var MimeTypeFunctions = dbm.importClass("com.developedbyme.utils.file.MimeTypeFunctions");
	
	staticFunctions.getFileExtensionForMimeType = function(aMimeType) {
		//console.log("com.developedbyme.utils.file.MimeTypeFunctions::getFileExtensionForMimeType");
		if(aMimeType == null) {
			//METODO: error message
			return null;
		}
		
		var mimeType = aMimeType;
		var semiColonPosition = aMimeType.indexOf(";")
		if(semiColonPosition != -1) {
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
		}
		//METODO: error message
		return null;
	};
});