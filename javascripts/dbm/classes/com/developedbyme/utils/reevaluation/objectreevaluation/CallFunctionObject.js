dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::_init");
		
		this.superCall();
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theFunction = this.functionReevaluator.reevaluate(aBaseObject);
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aBaseObject);
		return theFunction.apply(theObject, argumentsArray);
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand (static)");
		var newCommand = (new CallFunctionObject()).init();
		
		if(aObject instanceof ReevaluationBaseObject) {
			newCommand.objectReevaluator = aObject;
		}
		else {
			newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		}
		newCommand.functionReevaluator = StaticVariableObject.createReevaluationObject(aFunction);
		
		var hasReevaluatorInArgumentsArray = false;
		var theLength = aArgumentsArray.length;
		for(var i = 0; i < theLength; i++) {
			if(aArgumentsArray[i] instanceof ReevaluationBaseObject) {
				hasReevaluatorInArgumentsArray = true;
				break;
			}
		}
		
		if(hasReevaluatorInArgumentsArray) {
			newCommand.argumentsArrayReevaluator = ReevaluateArrayObject.createReevaluationObject(aArgumentsArray);
		}
		else {
			newCommand.argumentsArrayReevaluator = StaticVariableObject.createReevaluationObject(aArgumentsArray);
		}
		
		return newCommand;
	};
	
	staticFunctions.createFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand (static)");
		var newCommand = (new CallFunctionObject()).init();
		
		if(aObject instanceof ReevaluationBaseObject) {
			newCommand.objectReevaluator = aObject;
			newCommand.functionReevaluator = GetVariableObject.createCommand(aObject, aFunctionName);
		}
		else {
			newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
			newCommand.functionReevaluator = GetVariableObject.createCommand(newCommand.objectReevaluator, aFunctionName);
		}
		
		
		var hasReevaluatorInArgumentsArray = false;
		var theLength = aArgumentsArray.length;
		for(var i = 0; i < theLength; i++) {
			if(aArgumentsArray[i] instanceof ReevaluationBaseObject) {
				hasReevaluatorInArgumentsArray = true;
				break;
			}
		}
		
		if(hasReevaluatorInArgumentsArray) {
			newCommand.argumentsArrayReevaluator = ReevaluateArrayObject.createReevaluationObject(aArgumentsArray);
		}
		else {
			newCommand.argumentsArrayReevaluator = StaticVariableObject.createReevaluationObject(aArgumentsArray);
		}
		
		return newCommand;
	};
});