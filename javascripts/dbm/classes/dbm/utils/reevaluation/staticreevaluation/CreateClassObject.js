/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects a variable on an object.
 */
dbm.registerClass("dbm.utils.reevaluation.staticreevaluation.CreateClassObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.staticreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var CreateClassObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.CreateClassObject");
	
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
		//console.log("dbm.utils.reevaluation.staticreevaluation.CreateClassObject::_init");
		
		this.superCall();
		
		this.classReevaluator = null;
		
		return this;
	};
	
	/**
	 * Sets the class of whcih a new instance should be returned on reevaluated.
	 *
	 * @param	aClass	Function	The constructor function of the class.
	 *
	 * @return	self
	 */
	objectFunctions.setCalss = function(aClass) {
		
		var staticVaraiableObject = (new StaticVariableObject()).init();
		staticVaraiableObject.reevaluationData = aClass;
		
		this.classReevaluator = staticVaraiableObject;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The new instance of the class.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.staticreevaluation.CreateClassObject::reevaluate");
		var theClass = this.classReevaluator.reevaluate(aBaseObject);
		
		return new theClass();
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.classReevaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.classReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aClass	ReevalutionBaseObject|Function	The class to generate new instances from.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aClass) {
		//console.log("dbm.utils.reevaluation.staticreevaluation.CreateClassObject::createCommand (static)");
		//console.log(aPropertyName);
		var newCommand = (new CreateClassObject()).init();
		
		newCommand.classReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aClass);
		
		return newCommand;
	};
});