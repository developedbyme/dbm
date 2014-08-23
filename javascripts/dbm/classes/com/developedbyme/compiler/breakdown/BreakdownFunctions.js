/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions to broken down scripts.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.BreakdownFunctions", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.BreakdownFunctions");
	
	//Self reference
	var BreakdownFunctions = dbm.importClass("com.developedbyme.compiler.breakdown.BreakdownFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Gets a value or null.
	 *
	 * @param	aBreakdownPart	BreakdownFunctionsPart		The breakdown to get the value from.
	 *
	 * @return	*	The value or null.
	 */
	staticFunctions.getValueOrNull = function(aBreakdownPart) {
		
		aBreakdownPart = ClassReference.getBreakdownWithoutComments(aBreakdownPart);
		
		if(aBreakdownPart.getType() === BreakdownTypes.STRING) {
			return aBreakdownPart.getString();
		}
		else if(aBreakdownPart.getType() === BreakdownTypes.VARIABLE_REFERENCE && aBreakdownPart.getVariableName() === "null") {
			return null;
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[BreakdownFunctions]", "getValueOrNull", "Can't get value from " + aBreakdownPart.getType() + ".");
		return null;
	};
	
	/**
	 * Gets a breakdown that might be mixed in with comments.
	 *
	 * @param	aBreakdownPart	BreakdownFunctionsPart	The breakdown that may or may not contain a comment.
	 *
	 * @return	BreakdownFunctionsPart	The breakdown without comments.
	 */
	staticFunctions.getBreakdownWithoutComments = function(aBreakdownPart) {
		//console.log("com.developedbyme.compiler.breakdown.BreakdownFunctions::getBreakdownWithoutComments");
		//console.log(aBreakdownPart);
		
		if(aBreakdownPart.getType() === BreakdownTypes.EVALUATION) {
			var currentArray = aBreakdownPart.getChildBreakdowns();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentBreakdown = ClassReference.getBreakdownWithoutComments(currentArray[i]);
				console.log(">", currentBreakdown);
				if(currentBreakdown.getType() !== BreakdownTypes.COMMENT) {
					return currentBreakdown;
					//METODO: need to check that there is only one valid breakdown
				}
			}
		}
		return aBreakdownPart;
	};
	
	/**
	 * Gets the first parent of a specific type.
	 *
	 * @param	aBreakdownPart	ScriptBreakdownPart		The breakdown to start searching from.
	 * @param	aType			String					The type that the parent should be.
	 *
	 * @return	ScriptBreakdownPart	The first parent that matches the type. Null if none is found.
	 */
	staticFunctions.getParentByType = function(aBreakdownPart, aType) {
		var currentPart = aBreakdownPart;
		var debugCounter = 0;
		while(currentPart !== null) {
			if(debugCounter++ > 1000) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[BreakdownFunctions]", "getParentOfType", "Loop has gone for too long.");
				break;
			}
			if(currentPart.getType() === aType) {
				return currentPart;
			}
			currentPart = currentPart.getParent();
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[BreakdownFunctions]", "getParentOfType", "Part " + aBreakdownPart + " doesn't have parent of type " + aType + ".");
		return null;
	};
	
	/**
	 * Checks if a breakdown has a return statement.
	 *
	 * @param	aBreakdownPart	ScriptBreakdownPart		The breakdown to start searching in.
	 *
	 * @param	Boolean	True if the breakdown has a return statement.
	 */
	staticFunctions.checkForReturnStatement = function(aBreakdownPart) {
		//console.log("com.developedbyme.compiler.breakdown.BreakdownFunctions::checkForReturnStatement");
		//console.log(aBreakdownPart);
		
		var currentArray = aBreakdownPart.getChildBreakdowns();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentBreakdown = currentArray[i];
			var currentType = currentBreakdown.getType();
			if(currentType === BreakdownTypes.RETURN) {
				//METODO: check that it's actually returning a value
				return true;
			}
			if(currentType !== BreakdownTypes.FUNCTION_DECLARATION) {
				if(ClassReference.checkForReturnStatement(currentBreakdown)) {
					return true;
				}
			}
		}
		return false;
	};
});