/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions to create reevalution objects.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.ReevaluationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Self reference
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Error report
	
	//Dependencies
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Creates a static reevaluation if the value isn't already an reevaluator.
	 *
	 * @param	aValue	ReevaluationBaseObject|*	The value to return a reevaluation object for.
	 *
	 * @return	ReevaluationBaseObject	The new (or passed) reevalution object.
	 */
	staticFunctions.reevaluationOrStaticValue = function(aValue) {
		//console.log("com.developedbyme.utils.reevaluation.ReevaluationCreator::reevaluationOrStaticValue");
		
		if(aValue instanceof ReevaluationBaseObject) {
			return aValue;
		}
		else {
			return StaticVariableObject.createReevaluationObject(aValue);
		}
	};
	
	/**
	 * Creates an array reevaluation if the value isn't already an reevaluator.
	 *
	 * @param	aValue	ReevaluationBaseObject|Array	The value to return a reevaluation object for.
	 *
	 * @return	ReevaluationBaseObject	The new (or passed) reevalution object.
	 */
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