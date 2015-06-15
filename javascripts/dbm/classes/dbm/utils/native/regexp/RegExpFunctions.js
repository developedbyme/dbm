/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.regexp.RegExpFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.regexp.RegExpFunctions");
	//"use strict";
	
	//Self reference
	var RegExpFunctions = dbm.importClass("dbm.utils.native.regexp.RegExpFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Constants
	
	
	staticFunctions.getSafeText = function(aText) {
		var safeRegExp = new RegExp("([\\.\\*\\?\\+\\{\\}\\[\\]\\(\\)\\\\\\|\\^\\$])", "g");
		return aText.replace(safeRegExp, "\\$1");
	};
	
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
			//MENOTE: this shouldn't have a warning
			//ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[RegExpFunctions]", "matchTextInRegExpArrayWithNames", "String " + aText + " doesn't have a regexp match to any of these names " + aNamesArray + ".");
			return null;
		}
		return aNamesArray[index];
	};
});