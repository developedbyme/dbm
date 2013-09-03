dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	var ObjectReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var NoChangeObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		
		return this;
	};
	
	/**
	 * Sets the object reevaluator to use the base object.
	 *
	 * @return	self
	 */
	objectFunctions.useBaseObjectAsObject = function() {
		this.objectReevaluator = (new NoChangeObject()).init();
		
		return this;
	};
	
	/**
	 * Sets the object reevaluator to use a static object.
	 *
	 * @return	self
	 */
	objectFunctions.setStaticObjectAsObject = function(aObject) {
		var staticVaraiableObject = (new StaticVariableObject()).init();
		staticVaraiableObject.reevaluationData = aObject;
		
		this.objectReevaluator = staticVaraiableObject;
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});