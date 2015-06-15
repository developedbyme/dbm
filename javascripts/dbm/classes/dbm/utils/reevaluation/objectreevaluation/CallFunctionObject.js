/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluation that returns the value of a function call.
 */
dbm.registerClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject::_init");
		
		this.superCall();
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference. Should be overridden.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The result of the reevaluation.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject::reevaluate");
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
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.functionReevaluator = null;
		this.argumentsArrayReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new command of this class.
	 *
	 * @param	aObject				ReevaluationBaseObject|*			The object to call the function on.
	 * @param	aFunction			ReevaluationBaseObject|Function		The function to call.
	 * @param	aArgumentsArray		ReevaluationBaseObject|Array		The arguemnts to call the function with.
	 *
	 * @return	CallFunctionObject	The newly created command.
	 */
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand");
		
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
	
	/**
	 * Creates a new command of this class, that calls a function by name.
	 *
	 * @param	aObject				ReevaluationBaseObject|*		The object to call the function on.
	 * @param	aFunction			ReevaluationBaseObject|String	The name function to call.
	 * @param	aArgumentsArray		ReevaluationBaseObject|Array	The arguemnts to call the function with.
	 *
	 * @return	CallFunctionObject	The newly created command.
	 */
	staticFunctions.createFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject::createCommand");
		
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
		return ClassReference.createFunctionOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aFunctionName, aArgumentsArray);
	};
});