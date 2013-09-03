dbm.registerClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject::_init");
		
		this.superCall();
		
		this.reevaluationData = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.reevaluationData;
	};
	
	/**
	 * The function that reevalutes this reference. Should be overridden.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	null
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		//MENOTE: should be overridden
		
		return this.reevaluationData;
	} //End function reevaluate
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationData = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "reevaluationData":
				return false;
		}
		return this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that returns a static value.
	 * 
	 * @param	aData	The data to return when beeing resolved
	 * @return	The new object.
	 */
	staticFunctions.createReevaluationObject = function(aData) {
		var newObject = (new StaticVariableObject()).init();
		newObject.reevaluationData = aData;
		return newObject;
	};
});