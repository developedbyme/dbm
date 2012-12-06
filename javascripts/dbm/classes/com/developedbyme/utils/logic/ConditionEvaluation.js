/**
 * Static class for evaluating conditions.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.logic.ConditionEvaluation", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.logic.ConditionEvaluation");
	
	var ConditionEvaluation = dbm.importClass("com.developedbyme.utils.logic.ConditionEvaluation");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.evaluateCondition = function(aInputValue1, aConditionType, aInputValue2) {
		var returnValue;
		switch(aConditionType) {
			case "==":
				returnValue = (aInputValue1 == aInputValue2);
				break;
			case "===":
				returnValue = (aInputValue1 === aInputValue2);
				break;
			case ">=":
				returnValue = (aInputValue1 >= aInputValue2);
				break;
			case ">":
				returnValue = (aInputValue1 > aInputValue2);
				break;
			case "<=":
				returnValue = (aInputValue1 <= aInputValue2);
				break;
			case "<":
				returnValue = (aInputValue1 < aInputValue2);
				break;
			case "!=":
				returnValue = (aInputValue1 != aInputValue2);
				break;
			case "!==":
				returnValue = (aInputValue1 !== aInputValue2);
				break;
			case "&&":
				returnValue = (aInputValue1 && aInputValue2);
				break;
			case "||":
				returnValue = (aInputValue1 || aInputValue2);
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[ConditionEvaluation]", "evaluateCondition", "Unknown condition type " + aConditionType + ".");
				returnValue = null;
				break;
		}
		
		return returnValue;
	};
});