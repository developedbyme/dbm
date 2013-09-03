dbm.registerClass("com.developedbyme.utils.native.object.ObjectFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.object.ObjectFunctions");
	
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.identifyProperty = function(aPropertyValue, aObject) {
		for(var objectName in aObject) {
			if(aObject[objectName] === aPropertyValue) {
				return objectName;
			}
		}
		
		return null;
	};
	
	staticFunctions.typeOfValue = function(aValue) {
		//console.log("com.developedbyme.utils.native.object.ObjectFunctions::typeOfValue");
		//console.log(aValue);
		var valueType = typeof(aValue);
		
		if(valueType === JavascriptObjectTypes.TYPE_OBJECT) {
			if(aValue === null) {
				return JavascriptObjectTypes.NON_REAL_TYPE_NULL;
			}
			else if(aValue instanceof Array) {
				return JavascriptObjectTypes.NON_REAL_TYPE_ARRAY;
			}
		}
		return valueType;
	};
});