/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.NativeAppUrlGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.NativeAppUrlGenerator");
	
	//Self reference
	var NativeAppUrlGenerator = dbm.importClass("dbm.utils.file.NativeAppUrlGenerator");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Gets a url that will open a new sms message.
	 * Messages doesn't work since iOS 8.
	 */
	staticFunctions.getSmsUrl = function(aPhoneNumber, aMessage, aDelimeter) {
		//console.log("dbm.utils.file.NativeAppUrlGenerator::getFileExtensionForMimeType");
		
		var returnString = "sms:" + aPhoneNumber;
		
		if(VariableAliases.isSet(aMessage) && !VariableAliases.isEmptyText(aMessage)) {
			if(!VariableAliases.isSet(aDelimeter)) {
				aDelimeter = "?"; //METODO: Different format for ios and android
			}
			returnString += aDelimeter + "body=" + encodeURIComponent(aMessage);
		}
		
		return returnString;
	};
});