dbm.registerClass("com.developedbyme.utils.data.VariableAliases", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.VariableAliases");
	//"use strict";
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.TRUE_STRINGS = ["true", "yes", "y", "1"];
	staticFunctions.FALSE_STRINGS = ["false", "no", "n","0"];
	staticFunctions.NULL_STRINGS = ["null", "undefined", "none",  ""];
	
	staticFunctions.IS_TRUE = 1;
	staticFunctions.IS_FALSE = 0;
	staticFunctions.INDETERMINATE = -1;
	
	staticFunctions.stringIsAlias = function(aString, aArray) {
		var lowerCaseString = aString.toLowerCase();
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(lowerCaseString === currentArray[i]) {
				return true;
			}
		}
		return false;
	};
	
	staticFunctions.determinIfStringIsBoolean = function(aString) {
		if(ClassReference.stringIsAlias(aString, ClassReference.TRUE_STRINGS)) {
			return ClassReference.IS_TRUE;
		}
		else if(ClassReference.stringIsAlias(aString, ClassReference.FALSE_STRINGS)) {
			return ClassReference.IS_FALSE;
		}
		return ClassReference.INDETERMINATE;
	};
	
	staticFunctions.determinIfVariableIsBoolean = function(aVariable) {
		switch(typeof(aVariable)) {
			case JavascriptObjectTypes.TYPE_BOOLEAN:
				return (aVariable ? ClassReference.IS_TRUE : ClassReference.IS_FALSE);
			case JavascriptObjectTypes.TYPE_STRING:
				var stringDetermination = ClassReference.determinIfStringIsBoolean(aVariable);
				if(stringDetermination === ClassReference.INDETERMINATE) {
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "determinIfVariableIsBoolean", "No match for string " + aVariable);
				}
				return stringDetermination;
			case JavascriptObjectTypes.TYPE_NUMBER:
				if(aVariable === 1) {
					return ClassReference.IS_TRUE;
				}
				else if(aVariable === 0) {
					return ClassReference.IS_FALSE;
				}
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "determinIfVariableIsBoolean", "No match for number " + aVariable);
				return ClassReference.INDETERMINATE;
			default:
				if(aVariable !== null && aVariable !== undefined) {
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "determinIfVariableIsBoolean", "No case for object type for variable " + aVariable);
				}
				return ClassReference.INDETERMINATE;
		}
	};
	
	/**
	 * Checks if the variable is true.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is true.
	 */
	staticFunctions.isTrue = function(aVariable) {
		return (ClassReference.determinIfVariableIsBoolean(aVariable) === ClassReference.IS_TRUE);
	};
	
	/**
	 * Checks if the variable is false.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is false.
	 */
	staticFunctions.isFalse = function(aVariable) {
		return (ClassReference.determinIfVariableIsBoolean(aVariable) === ClassReference.IS_FALSE);
	};
	
	/**
	 * Checks if the variable is null.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is false.
	 */
	staticFunctions.isNull = function(aVariable) {
		if(typeof(aVariable) === JavascriptObjectTypes.TYPE_BOOLEAN) {
			return false;
		}
		if(aVariable === null || aVariable === undefined) {
			return true;
		}
		if(typeof(aVariable) === JavascriptObjectTypes.TYPE_STRING) {
			return ClassReference.stringIsAlias(aString, ClassReference.NULL_STRINGS);
		}
		if(typeof(aVariable) === JavascriptObjectTypes.TYPE_NUMBER) {
			return isNaN(aVariable);
		}
		
		//ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isNull", "No case for object type (" + typeof(aVariable) + ") for variable " + aVariable);
		return false;
	};
	
	/**
	 * Checks if a text is empty.
	 */
	staticFunctions.isEmptyText = function(aString) {
		//trace("breel.utils.data.VariableAliases.isEmptyText");
		var regExpString = "^[ \t\f\n\r]*$";
		var regExp = new RegExp(regExpString);
		return regExp.test(aString);
	}; //End function isEmptyText
	
	staticFunctions.valueWithDefault = function(aValue, aDefaultValue) {
		//console.log("com.developedbyme.utils.data.VariableAliases::valueWithDefault");
		//console.log(aValue, aDefaultValue);
		if(!ClassReference.isSet(aValue)) {
			return aDefaultValue;
		}
		return aValue;
	};
	
	staticFunctions.isSet = function(aValue) {
		//console.log("com.developedbyme.utils.data.VariableAliases::isSet");
		if(aValue === null || aValue === undefined) {
			return false;
		}
		return true;
	};
});