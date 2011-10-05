dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject::init");
		
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
	}
	
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
		return theObject[propertyName];
	}
	
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
		
		if(aObject.reevaluate != undefined) {
			newCommand.objectReevaluator = aObject;
		}
		else {
			newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		}
		newCommand.propertyNameReevaluator = StaticVariableObject.createReevaluationObject(aPropertyName);
		
		return newCommand;
	}
	
	/**
	 * Creates a command that gets a the data of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectDataCommand = function() {
		var newCommand = (new GetVariableObject()).init();
		
		newCommand.objectReevaluator = (new SelectBaseObjectObject()).init();
		newCommand.propertyNameReevaluator = StaticVariableObject.createReevaluationObject("data");
		
		return newCommand;
	}
	
	/**
	 * Creates a command that gets a the owner object of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectOwnerObjectCommand = function() {
		var newCommand = (new GetVariableObject()).init();
		
		newCommand.objectReevaluator = (new SelectBaseObjectObject()).init();
		newCommand.propertyNameReevaluator = StaticVariableObject.createReevaluationObject("ownerObject");
		
		return newCommand;
	}
	
	/**
	 * Creates a command that gets a the performing object of an event data object.
	 * 
	 * @return	The new command.
	 */
	staticFunctions.createSelectPerformingObjectCommand = function() {
		var newCommand = (new GetVariableObject()).init();
		
		newCommand.objectReevaluator = (new SelectBaseObjectObject()).init();
		newCommand.propertyNameReevaluator = StaticVariableObject.createReevaluationObject("performingObject");
		
		return newCommand;
	}
});