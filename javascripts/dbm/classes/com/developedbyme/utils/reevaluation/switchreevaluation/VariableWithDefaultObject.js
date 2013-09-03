dbm.registerClass("com.developedbyme.utils.reevaluation.switchreevaluation.VariableWithDefaultObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.switchreevaluation.VariableWithDefaultObject");
	
	var VariableWithDefaultObject = dbm.importClass("com.developedbyme.utils.reevaluation.switchreevaluation.VariableWithDefaultObject");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.switchreevaluation.VariableWithDefaultObject::_init");
		
		this.superCall();
		
		this.variableReevaluation = null;
		this.defaultReevaluation = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.reevaluationData;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	null
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		var returnValue = this.variableReevaluation.reevaluate(aBaseObject);
		if(returnValue === null) {
			returnValue = this.defaultReevaluation.reevaluate(aBaseObject);
		}
		
		return returnValue;
	} //End function reevaluate
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.variableReevaluation = null;
		this.defaultReevaluation = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that returns a value or if that is null returns a default value.
	 * 
	 * @param	aVariable	The reevaluation object for the variable.
	 * @param	aDefault	The default value
	 * @return	The new object.
	 */
	staticFunctions.createReevaluationObject = function(aVariable, aDefault) {
		var newObject = (new VariableWithDefaultObject()).init();
		if(aVariable instanceof ReevaluationBaseObject) {
			newObject.variableReevaluation = aVariable;
		}
		else {
			newObject.variableReevaluation = StaticVariableObject.createReevaluationObject(aVariable);
		}
		if(aDefault instanceof ReevaluationBaseObject) {
			newObject.defaultReevaluation = aDefault;
		}
		else {
			newObject.defaultReevaluation = StaticVariableObject.createReevaluationObject(aDefault);
		}
		return newObject;
	}
});