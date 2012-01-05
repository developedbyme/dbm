dbm.registerClass("com.developedbyme.utils.native.object.ObjectFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.object.ObjectFunctions");
	
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.identifyProperty = function(aPropertyValue, aObject) {
		for(var objectName in aObject) {
			if(aObject[objectName] === aPropertyValue) {
				return objectName;
			}
		}
		
		return null;
	};
});