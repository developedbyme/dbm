/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
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
		
		return theFunction.apply(theObject, argumentsArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand (static)");
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