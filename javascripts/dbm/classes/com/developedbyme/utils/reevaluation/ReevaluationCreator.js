/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.ReevaluationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	staticFunctions.reevaluationOrStaticValue = function(aValue) {
		//console.log("com.developedbyme.utils.reevaluation.ReevaluationCreator::reevaluationOrStaticValue");
		
		if(aValue instanceof ReevaluationBaseObject) {
			return aValue;
		}
		else {
			return StaticVariableObject.createReevaluationObject(aValue);
		}
		
	};
	
	staticFunctions.arrayReevaluationOrStaticValue = function(aValue) {
		//console.log("com.developedbyme.utils.reevaluation.ReevaluationCreator::arrayReevaluationOrStaticValue");
		
		if(aValue instanceof ReevaluationBaseObject) {
			return aValue;
		}
		else {
			var hasReevaluatorInArgumentsArray = false;
			var currentArray = aValue;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				if(currentArray[i] instanceof ReevaluationBaseObject) {
					hasReevaluatorInArgumentsArray = true;
					break;
				}
			}
			
			if(hasReevaluatorInArgumentsArray) {
				return ReevaluateArrayObject.createReevaluationObject(currentArray);
			}
			else {
				return StaticVariableObject.createReevaluationObject(currentArray);
			}
		}
	};
});