dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand::init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this._supressErrors = true;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand::perform");
		//console.log(aEventDataObject);
		
		var theObject = this.objectReevaluator.reevaluate(aEventDataObject);
		var theFunction = this.functionReevaluator.reevaluate(aEventDataObject);
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aEventDataObject);
		
		var theResult;
		if(this._supressErrors) {
			try {
				theResult = theFunction.apply(theObject, argumentsArray);
				aEventDataObject.addResult(theResult);
			}
			catch(theError) {
				ErrorManager.getInstance().reportError(this, "perform", theError);
				return CommandStatusTypes.ERROR;
			}
		}
		else {
			theResult = theFunction.apply(theObject, argumentsArray);
			aEventDataObject.addResult(theResult);
		}
		
		aEventDataObject.addResult(null);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	/**
	 * Creates a command that calls a function on the performing object.
	 * 
	 * @param	aFunction		The function to call.
	 * @param	aArgumentsArray	The arguments to pass to the function.
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray) {
		var newCommand = (new CallFunctionCommand()).init();
		
		newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		
		newCommand.functionReevaluator = StaticVariableObject.createReevaluationObject(aFunction);
		
		var hasReevaluatorInArgumentsArray = false;
		var theLength = aArgumentsArray.length;
		for(var i = 0; i < theLength; i++) {
			if(aArgumentsArray[i].reevaluate != undefined) {
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
	}
	
	/**
	 * Creates a command that calls a function.
	 * 
	 * @param	aObject			The object to call the function (if null then the performing object will be used).
	 * @param	aFunctionName	The name of the function to call.
	 * @param	aArgumentsArray	The arguments to pass to the function.
	 * @return	The new command.
	 */
	staticFunctions.createCallFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray) {
		var newCommand = (new CallFunctionCommand()).init();
		
		var newFunctionReevaluator = (new GetVariableObject()).init();
		newFunctionReevaluator.propertyNameReevaluator = StaticVariableObject.createReevaluationObject(aFunctionName);
		
		newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		newFunctionReevaluator.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		
		newCommand.functionReevaluator = newFunctionReevaluator;
		
		var hasReevaluatorInArgumentsArray = false;
		var theLength = aArgumentsArray.length;
		for(var i = 0; i < theLength; i++) {
			if(aArgumentsArray[i].reevaluate != undefined) {
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
	}
});