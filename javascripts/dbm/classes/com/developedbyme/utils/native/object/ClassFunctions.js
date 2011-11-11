dbm.registerClass("com.developedbyme.utils.native.object.ClassFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.object.ClassFunctions");
	
	var ClassFunctions = dbm.importClass("com.developedbyme.utils.native.object.ClassFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var StringRegularExpressions = dbm.importClass("com.developedbyme.utils.native.string.StringRegularExpressions");
	
	staticFunctions.getConstantNames = function(aClass) {
		if(aClass == null) {
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