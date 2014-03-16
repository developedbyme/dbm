/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this._supressErrors = true;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theObject = this.objectReevaluator.reevaluate(aEventDataObject);
		var theFunction = this.functionReevaluator.reevaluate(aEventDataObject);
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aEventDataObject);
		
		var theResult;
		if(this._supressErrors) {
			try {
				if(!VariableAliases.isSet(theFunction)) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Function is null. Can't create call on object " + theObject + " with arguments " + argumentsArray);
					return CommandStatusTypes.ERROR;
				}
				theResult = theFunction.apply(theObject, argumentsArray);
				aEventDataObject.addResult(theResult);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Error occured in " + theObject + " " + theFunction);
				ErrorManager.getInstance().reportError(this, "perform", theError);
				aEventDataObject.addResult(null);
				return CommandStatusTypes.ERROR;
			}
		}
		else {
			theResult = theFunction.apply(theObject, argumentsArray);
			aEventDataObject.addResult(theResult);
		}
		
		return CommandStatusTypes.CONTINUE;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("object: " + this.objectReevaluator);
		aReturnArray.push("function: " + this.functionReevaluator);
		aReturnArray.push("arguments: " + this.argumentsArrayReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.objectReevaluator);
		ClassReference.softDestroyIfExists(this.functionReevaluator);
		ClassReference.softDestroyIfExists(this.argumentsArrayReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.objectReevaluator = null;
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
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
		
		if(!VariableAliases.isSet(aFunction)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[CallFunctionCommand]", "createCommand", "Function is null. Can't create call for " + aFunction + " on object " + aObject + " with arguments " + aArgumentsArray);
			return null;
		}
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.functionReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aFunction);
		newCommand.argumentsArrayReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArgumentsArray);
		
		return newCommand;
	};
	
	/**
	 * Creates a command that calls a function.
	 * 
	 * @param	aObject			The object to call the function (if null then the performing object will be used).
	 * @param	aFunctionName	The name of the function to call.
	 * @param	aArgumentsArray	The arguments to pass to the function.
	 * @return	The new command.
	 */
	staticFunctions.createCallFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray) {
		return ClassReference.createCommand(aObject, GetVariableObject.createCommand(aObject, aFunctionName), aArgumentsArray);
	};
	
	/**
	 * Creates a command that calls a function on the performing object.
	 * 
	 * @param	aFunctionName	The name of the function to call.
	 * @param	aArgumentsArray	The arguments to pass to the function.
	 * @return	The new command.
	 */
	staticFunctions.createCallFunctionOnPerformingObjectCommand = function(aFunctionName, aArgumentsArray) {
		return ClassReference.createCallFunctionOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aFunctionName, aArgumentsArray);
	};
});