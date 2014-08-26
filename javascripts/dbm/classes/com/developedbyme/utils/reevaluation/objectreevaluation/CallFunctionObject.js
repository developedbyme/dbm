/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluation that returns the value of a function call.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::_init");
		
		this.superCall();
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::reevaluate");
		//console.log(this);
		
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theFunction = this.functionReevaluator.reevaluate(aBaseObject);
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aBaseObject);
		
		//console.log(theObject, theFunction, argumentsArray);
		
		if(!VariableAliases.isSet(theFunction)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "reevaluate", "Function is null. Can't create call on object " + theObject + " with arguments " + argumentsArray);
			return null;
		}
		
		return theFunction.apply(theObject, argumentsArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand (static)");
		
		if(!VariableAliases.isSet(aFunction)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[CallFunctionObject]", "createCommand", "Function is null. Can't create call for " + aFunction + " on object " + aObject + " with arguments " + aArgumentsArray);
			return null;
		}
		
		var newCommand = (new CallFunctionObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.functionReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aFunction);
		newCommand.argumentsArrayReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArgumentsArray);
		
		return newCommand;
	};
	
	staticFunctions.createFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand (static)");
		
		return ClassReference.createCommand(aObject, GetVariableObject.createCommand(aObject, aFunctionName), aArgumentsArray);
	};
});