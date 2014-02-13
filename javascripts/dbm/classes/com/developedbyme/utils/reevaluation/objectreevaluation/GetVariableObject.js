dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Error report
	
	//Dependencies
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject::_init");
		
		this.superCall();
		
		this.propertyNameReevaluator = null;
		
		return this;
	};
	
	/**
	 * Sets the property name that should be returned on reevaluated.
	 *
	 * @param	aName	The name of the property.
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
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var propertyName = this.propertyNameReevaluator.reevaluate(aBaseObject);
		
		//console.log(theObject, propertyName);
		
		return theObject[propertyName];
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.propertyNameReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyNameReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aObject			The object to get the property on
	 * @param	aPropertyName	The name of the property to get.
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aPropertyName) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject::createCommand (static)");
		//console.log(aPropertyName);
		var newCommand = (new GetVariableObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.propertyNameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aPropertyName);
		
		return newCommand;
	};
	
	staticFunctions.createSelectOnBaseObjectCommand = function(aPropertyName) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject::createSelectOnBaseObjectCommand (static)");
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
	 * @return	The new command.
	 */
	staticFunctions.createSelectMultipleArgumentDataCommand = function(aIndex) {
		return ClassReference.createCommand(ClassReference.createSelectDataCommand(), aIndex);
	};
});