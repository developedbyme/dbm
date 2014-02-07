dbm.registerClass("com.developedbyme.utils.native.regexp.RegExpFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.regexp.RegExpFunctions");
	//"use strict";
	
	//Self reference
	var RegExpFunctions = dbm.importClass("com.developedbyme.utils.native.regexp.RegExpFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Constants
	
	staticFunctions.matchTextInRegExpArray = function(aText, aRegExpArray) {
		var currentArray = aRegExpArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aText.match(currentArray[i])) {
				return i;
			}
		}
		return -1;
	};
	
	staticFunctions.matchTextInRegExpArrayWithNames = function(aText, aRegExpArray, aNamesArray) {
		var index = ClassReference.matchTextInRegExpArray(aText, aRegExpArray);
		if(index === -1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[RegExpFunctions]", "matchTextInRegExpArrayWithNames", "String " + aText + " doesn't have a regexp match to any of these names " + aNamesArray + ".");
			return null;
		}
		return aNamesArray[index];
	};
});