/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Static class for evaluating conditions.
 */
dbm.registerClass("com.developedbyme.utils.logic.ConditionEvaluation", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.logic.ConditionEvaluation");
	
	//Self reference
	var ConditionEvaluation = dbm.importClass("com.developedbyme.utils.logic.ConditionEvaluation");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var ConditionOperationTypes = dbm.importClass("com.developedbyme.constants.ConditionOperationTypes");
	
	/**
	 * Evaluates a contition
	 *
	 * @param	aInputValue1	Any		The first value check a with the condition.
	 * @param	aConditionType	String	The condition to evaluate the values against
	 * @param	aInputValue2	Any		The second value check a with the condition.
	 *
	 * @return	Boolean	The result of the evaluation. Null if the condition type doesn't exist.
	 */
	staticFunctions.evaluateCondition = function(aInputValue1, aConditionType, aInputValue2) {
		var returnValue;
		switch(aConditionType) {
			case ConditionOperationTypes.EQUAL:
				returnValue = (aInputValue1 == aInputValue2);
				break;
			case ConditionOperationTypes.IDENTICALLY_EQUAL:
				returnValue = (aInputValue1 === aInputValue2);
				break;
			case ConditionOperationTypes.GREATER_THAN_OR_EQUAL:
				returnValue = (aInputValue1 >= aInputValue2);
				break;
			case ConditionOperationTypes.GREATER_THAN:
				returnValue = (aInputValue1 > aInputValue2);
				break;
			case ConditionOperationTypes.LESSER_THAN_OR_EQUAL:
				returnValue = (aInputValue1 <= aInputValue2);
				break;
			case ConditionOperationTypes.LESSER_THAN:
				returnValue = (aInputValue1 < aInputValue2);
				break;
			case ConditionOperationTypes.NOT_EQUAL:
				returnValue = (aInputValue1 != aInputValue2);
				break;
			case ConditionOperationTypes.NOT_IDENTICALLY_EQUAL:
				returnValue = (aInputValue1 !== aInputValue2);
				break;
			case ConditionOperationTypes.AND:
				returnValue = (aInputValue1 && aInputValue2);
				break;
			case ConditionOperationTypes.OR:
				returnValue = (aInputValue1 || aInputValue2);
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[ConditionEvaluation]", "evaluateCondition", "Unknown condition type " + aConditionType + ".");
				returnValue = null;
				break;
		}
		
		return returnValue;
	}; //End function evaluateCondition 
});