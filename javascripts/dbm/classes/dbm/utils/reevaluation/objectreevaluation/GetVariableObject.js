/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects a variable on an object.
 */
dbm.registerClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Self reference
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Error report
	
	//Dependencies
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.objectreevaluation.GetVariableObject::_init");
		
		this.superCall();
		
		this.propertyNameReevaluator = null;
		
		return this;
	};
	
	/**
	 * Sets the property name that should be returned on reevaluated.
	 *
	 * @param	aName	String	The name of the property.
	 *
	 * @return	self
	 */
	objectFunctions.setPropertyName = function(aName) {
		
		var staticVaraiableObject = (new StaticVariableObject()).init();
		staticVaraiableObject.reevaluationData = aName;
		
		this.propertyNameReevaluator = staticVaraiableObject;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.GetVariableObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var propertyName = this.propertyNameReevaluator.reevaluate(aBaseObject);
		
		//console.log(theObject, propertyName);
		
		return theObject[propertyName];
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.propertyNameReevaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyNameReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aObject			ReevalutionBaseObject|*		The object to get the property on
	 * @param	aPropertyName	ReevalutionBaseObject|String	The name of the property to get.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aPropertyName) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.GetVariableObject::createCommand (static)");
		//console.log(aPropertyName);
		var newCommand = (new GetVariableObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.propertyNameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aPropertyName);
		
		return newCommand;
	};
	
	staticFunctions.createSelectOnBaseObjectCommand = function(aPropertyName) {
		//console.log("dbm.utils.reevaluation.objectreevaluation.GetVariableObject::createSelectOnBaseObjectCommand (static)");
		//console.log(aPropertyName);
		
		return ClassReference.createCommand((new SelectBaseObjectObject()).init(), aPropertyName);
	};
	
	/**
	 * Creates a command that gets a the data of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectDataCommand = function() {
		return ClassReference.createSelectOnBaseObjectCommand("data");
	};
	
	/**
	 * Creates a command that gets a the owner object of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectOwnerObjectCommand = function() {
		return ClassReference.createSelectOnBaseObjectCommand("ownerObject");
	};
	
	/**
	 * Creates a command that gets a the performing object of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectPerformingObjectCommand = function() {
		return ClassReference.createSelectOnBaseObjectCommand("performingObject");
	};
	
	/**
	 * Creates a command that gets an argument of an event data.
	 *
	 * @param	aIndex	ReevalutionBaseObject|Number	The index of the arguments to get.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectMultipleArgumentDataCommand = function(aIndex) {
		return ClassReference.createCommand(ClassReference.createSelectDataCommand(), aIndex);
	};
	
	staticFunctions.createCommandsForPath = function(aPath) {
		var currentObject = (new SelectBaseObjectObject()).init();
		
		var currentArray = aPath.split("/");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentObject = ClassReference.createCommand(currentObject, currentArray[i]);
		}
		
		return currentObject;
	};
});