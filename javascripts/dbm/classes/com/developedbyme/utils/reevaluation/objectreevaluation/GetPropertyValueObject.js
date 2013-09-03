dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	var GetPropertyValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject::_init");
		
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
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var propertyName = this.propertyNameReevaluator.reevaluate(aBaseObject);
		return theObject.getProperty(propertyName).getValue();
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
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject::createCommand (static)");
		//console.log(aPropertyName);
		var newCommand = (new GetPropertyValueObject()).init();
		
		if(aObject instanceof ReevaluationBaseObject) {
			newCommand.objectReevaluator = aObject;
		}
		else {
			newCommand.objectReevaluator = StaticVariableObject.createReevaluationObject(aObject);
		}
		newCommand.propertyNameReevaluator = StaticVariableObject.createReevaluationObject(aPropertyName);
		
		return newCommand;
	};
});