dbm.registerClass("com.developedbyme.utils.data.VariableAliases", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.VariableAliases");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	/**
	 * Checks if the variable is true.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is true.
	 */
	staticFunctions.isTrue = function(aVariable) {
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_BOOLEAN) {
			return aVariable;
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_STRING) {
			switch(aVariable.toLowerCase()) {
				case "true":
				case "yes":
				case "y":
				case "1":
					return true;
				case "false":
				case "no":
				case "n":
				case "0":
					return false;
				default:
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isTrue", "No match for string " + aVariable);
					return false;
			}	
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_NUMBER) {
			if(aVariable == 1) {
				return true;
			}
			else if(aVariable == 0) {
				return false;
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isTrue", "No match for number " + aVariable);
				return false;
			}
		}
		if(aVariable == null || aVariable == undefined) {
			return false;
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isTrue", "No case for object type for variable " + aVariable);
		return false;
	}
	
	/**
	 * Checks if the variable is false.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is false.
	 */
	staticFunctions.isFalse = function(aVariable) {
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_BOOLEAN) {
			return aVariable;
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_STRING) {
			switch(aVariable.toLowerCase()) {
				case "true":
				case "yes":
				case "y":
				case "1":
					return false;
				case "false":
				case "no":
				case "n":
				case "0":
					return true;
				default:
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isFalse", "No match for string " + aVariable);
					return false;
			}	
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_NUMBER) {
			if(aVariable == 1) {
				return false;
			}
			else if(aVariable == 0) {
				return true;
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isFalse", "No match for number " + aVariable);
				return false;
			}
		}
		if(aVariable == null || aVariable == undefined) {
			return false;
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isFalse", "No case for object type for variable " + aVariable);
		return false;
	}
	
	/**
	 * Checks if the variable is null.
	 * 
	 * @param	aVariable	The variable to check.
	 * 
	 * @return	True if the varaible is false.
	 */
	staticFunctions.isNull = function(aVariable) {
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_BOOLEAN) {
			return false;
		}
		if(aVariable == null || aVariable == undefined) {
			return true;
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_STRING) {
			switch(aVariable.toLowerCase()) {
				case "null":
				case "undefined":
				case "none":
				case "":
					return true;
				default:
					return false;
			}	
		}
		if(typeof(aVariable) == JavascriptObjectTypes.TYPE_NUMBER) {
			return isNaN(aVariable);
		}
		
		//ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[VariableAliases]", "isNull", "No case for object type (" + typeof(aVariable) + ") for variable " + aVariable);
		return false;
	}
	
	/**
	 * Checks if a text is empty.
	 */
	 staticFunctions.isEmptyText = function(aString) {
		//trace("breel.utils.data.VariableAliases.isEmptyText");
		var regExpString = "^[ \t\f\n\r]*$";
		var regExp = new RegExp(regExpString);
		return regExp.test(aString);
	} //End function isEmptyText
	
	staticFunctions.valueWithDefault = function(aValue, aDefaultValue) {
		//console.log("com.developedbyme.utils.data.VariableAliases::valueWithDefault");
		//console.log(aValue, aDefaultValue);
		if(aValue == null || aValue == undefined) {
			return aDefaultValue;
		}
		return aValue;
	};
});