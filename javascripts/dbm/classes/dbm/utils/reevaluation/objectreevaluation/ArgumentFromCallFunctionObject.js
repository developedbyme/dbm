/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluation that returns an argument from the function call.
 */
dbm.registerClass("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject", "dbm.utils.reevaluation.objectreevaluation.CallFunctionObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var ArgumentFromCallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject");
	
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
		//console.log("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject::_init");
		
		this.superCall();
		
		this.returnArgumentsReevaluator = null;
		
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
		//console.log("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject::reevaluate");
		//console.log(this);
		
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theFunction = this.functionReevaluator.reevaluate(aBaseObject);
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aBaseObject);
		
		if(!VariableAliases.isSet(theFunction)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "reevaluate", "Function is null. Can't create call on object " + theObject + " with arguments " + argumentsArray);
			return null;
		}
		
		theFunction.apply(theObject, argumentsArray);
		
		return this.returnArgumentsReevaluator.reevaluate(argumentsArray);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.returnArgumentsReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new command of this class.
	 *
	 * @param	aObject				ReevaluationBaseObject|*			The object to call the function on.
	 * @param	aFunction			ReevaluationBaseObject|Function		The function to call.
	 * @param	aArgumentsArray		ReevaluationBaseObject|Array		The arguemnts to call the function with.
	 * @param	aArgumentIndex		ReevaluationBaseObject|Number		The index of the argument to return.
	 *
	 * @return	ArgumentFromCallFunctionObject	The newly created command.
	 */
	staticFunctions.createCommand = function(aObject, aFunction, aArgumentsArray, aArgumentIndex) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject::createCommand");
		
		if(!VariableAliases.isSet(aFunction)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[ArgumentFromCallFunctionObject]", "createCommand", "Function is null. Can't create call for " + aFunction + " on object " + aObject + " with arguments " + aArgumentsArray);
			return null;
		}
		
		var newCommand = (new ArgumentFromCallFunctionObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.functionReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aFunction);
		newCommand.argumentsArrayReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArgumentsArray);
		
		newCommand.returnArgumentsReevaluator = GetVariableObject.createSelectOnBaseObjectCommand(aArgumentIndex);
		
		return newCommand;
	};
	
	/**
	 * Creates a new command of this class, that calls a function by name.
	 *
	 * @param	aObject				ReevaluationBaseObject|*		The object to call the function on.
	 * @param	aFunction			ReevaluationBaseObject|String	The name function to call.
	 * @param	aArgumentsArray		ReevaluationBaseObject|Array	The arguemnts to call the function with.
	 * @param	aArgumentIndex		ReevaluationBaseObject|Number	The index of the argument to return.
	 *
	 * @return	ArgumentFromCallFunctionObject	The newly created command.
	 */
	staticFunctions.createFunctionOnObjectCommand = function(aObject, aFunctionName, aArgumentsArray, aArgumentIndex) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject::createCommand");
		
		return ClassReference.createCommand(aObject, GetVariableObject.createCommand(aObject, aFunctionName), aArgumentsArray, aArgumentIndex);
	};
});