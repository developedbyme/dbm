/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.DataSelector", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.DataSelector");
	//"use strict";
	
	//Self reference
	var DataSelector = dbm.importClass("com.developedbyme.utils.data.DataSelector");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	
	//Utils
	var ConditionObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Constants
	
	
	/**
	 * Selects the first base object that matches a dynamic variable to a value.
	 *
	 * @param	aVariableName	String	The name of the dynamic variable to match.
	 * @param	aMatchValue		Any		The value that the dynamiv variable should match.
	 * @param	aSearchArray	Array	The array of objects to search in.
	 *
	 * @return	BaseObject	The matching object. Null if no item is matched.
	 */
	staticFunctions.selectObjectByDynamicVariable = function(aVariableName, aMatchValue, aSearchArray) {
		var qualifier = ConditionObject.createCommand(
			CallFunctionObject.createFunctionOnObjectCommand(
				SelectBaseObjectObject.createCommand(),
				"getDynamicVariable",
				[aVariableName]
			),
			"===",
			aMatchValue
		);
		return ClassReference.getFirstMatch(qualifier, aSearchArray);
	};
	
	/**
	 * Selects the first object that matches a reevaluation.
	 *
	 * @param	aQualifyReevaluator	ReevaluationBaseObject	The reevalutor that matches the object.
	 * @param	aSearchArray		Array					The array of objects to search in.
	 *
	 * @return	Any	The matching object. Null if no item is matched.
	 */
	staticFunctions.getFirstMatch = function(aQualifyReevaluator, aSearchArray) {
		
		var currentArray = aSearchArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(aQualifyReevaluator.reevaluate(currentObject)) {
				return currentObject;
			}
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, "[DataSelector]", "getFirstMatch", "No match for " + aQualifyReevaluator + " searching " + aSearchArray);
		return null;
	};
});