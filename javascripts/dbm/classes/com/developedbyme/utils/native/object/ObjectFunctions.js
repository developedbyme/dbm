dbm.registerClass("com.developedbyme.utils.native.object.ObjectFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.object.ObjectFunctions");
	
	//Self reference
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
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
	
	staticFunctions.convertValueToType = function(aValue, aType) {
		//console.log("com.developedbyme.utils.native.object.ObjectFunctions::convertValueToType");
		//console.log(aValue, aType);
		
		switch(aType) {
			case JavascriptObjectTypes.TYPE_NUMBER:
				return parseFloat(aValue);
			case JavascriptObjectTypes.TYPE_STRING:
				return aValue.toString();
			case JavascriptObjectTypes.TYPE_BOOLEAN:
				return VariableAliases.isTrue(aValue);
			case JavascriptObjectTypes.NON_REAL_TYPE_ANY:
				//MENOTE: just return the value
				break;
			default:
				//METODO: error message
				break;
		}
		return aValue;
	};
});