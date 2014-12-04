/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.object.ClassFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.object.ClassFunctions");
	
	var ClassFunctions = dbm.importClass("dbm.utils.native.object.ClassFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var StringRegularExpressions = dbm.importClass("dbm.utils.native.string.StringRegularExpressions");
	
	staticFunctions.getConstantNames = function(aClass) {
		if(aClass === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[ClassFunctions]", "getConstantNames ", "Class is " + aClass + ". Can't get constants.");
			return null;
		}
		
		var returnArray = new Array();
		for(var objectName in aClass) {
			if(StringRegularExpressions.isScreamingCaps(objectName)) {
				returnArray.push(objectName);
			}
		}
		return returnArray;
	};
});