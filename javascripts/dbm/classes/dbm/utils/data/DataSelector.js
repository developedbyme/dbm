/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for dynamically select data in an array.
 */
dbm.registerClass("dbm.utils.data.DataSelector", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.DataSelector");
	//"use strict";
	
	//Self reference
	var DataSelector = dbm.importClass("dbm.utils.data.DataSelector");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	
	//Utils
	var ConditionObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.ConditionObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Constants
	
	
	/**
	 * Selects the first base object that matches a dynamic variable to a value.
	 *
	 * @param	aVariableName	ReevaluationBaseObject|String	The name of the dynamic variable to match.
	 * @param	aMatchValue		ReevaluationBaseObject|Any		The value that the dynamiv variable should match.
	 * @param	aSearchArray	Array							The array of objects to search in.
	 *
	 * @return	BaseObject	The matching object. Null if no item is matched.
	 */
	staticFunctions.selectObjectByDynamicVariable = function(aVariableName, aMatchValue, aSearchArray) {
		return ClassReference.getFirstEqualMatch(
			CallFunctionObject.createFunctionOnObjectCommand(
				SelectBaseObjectObject.createCommand(),
				"getDynamicVariable",
				[aVariableName]
			),
			aMatchValue,
			aSearchArray
		);
	};
	
	/**
	 * Gets the first match that has to equal values.
	 *
	 * @param	aValue1			ReevaluationBaseObject|Any		The first value in the comparison.
	 * @param	aValue2			ReevaluationBaseObject|Any		The second value in the comparison.
	 * @param	aSearchArray	Array							The array of objects to search in.
	 *
	 * @return	Any	The matching object. Null if no item is matched.
	 */
	staticFunctions.getFirstEqualMatch = function(aValue1, aValue2, aSearchArray) {
		//console.log("dbm.utils.data.DataSelector::getFirstEqualMatch");
		var qualifier = ConditionObject.createCommand(
			aValue1,
			"===",
			aValue2
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
		//console.log("dbm.utils.data.DataSelector::getFirstMatch");
		//console.log(aQualifyReevaluator, aSearchArray);
		
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
	
	/**
	 * Gets the first match that has to equal values in a tree structure.
	 *
	 * @param	aValue1				ReevaluationBaseObject|Any		The first value in the comparison.
	 * @param	aValue2				ReevaluationBaseObject|Any		The second value in the comparison.
	 * @param	aTreeStructureItem	Array							The tree structure item to search from.
	 *
	 * @return	TreeStructureItem	The matching object. Null if no item is matched.
	 */
	staticFunctions.getFirstEqualMatchInTreeStructure = function(aValue1, aValue2, aTreeStructureItem) {
		//console.log("dbm.utils.data.DataSelector::getFirstEqualMatch");
		var qualifier = ConditionObject.createCommand(
			aValue1,
			"===",
			aValue2
		);
		return ClassReference.getFirstMatchInTreeStructure(qualifier, aTreeStructureItem);
	};
	
	/**
	 * Selects the first object that matches a reevaluation in a tree structure.
	 *
	 * @param	aQualifyReevaluator	ReevaluationBaseObject	The reevalutor that matches the object.
	 * @param	aTreeStructureItem	TreeStructureItem		The tree structure item to search from.
	 *
	 * @return	TreeStructureItem	The matching object. Null if no item is matched.
	 */
	staticFunctions.getFirstMatchInTreeStructure = function(aQualifyReevaluator, aTreeStructureItem) {
		//console.log("dbm.utils.data.DataSelector::getFirstMatchInTreeStructure");
		//console.log(aQualifyReevaluator, aTreeStructureItem);
		
		var currentArray = aTreeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(aQualifyReevaluator.reevaluate(currentObject)) {
				return currentObject;
			}
			var returnValue = ClassReference.getFirstMatchInTreeStructure(aQualifyReevaluator, currentObject);
			if(returnValue !== null) {
				return returnValue;
			}
		}
		return null;
	};
});