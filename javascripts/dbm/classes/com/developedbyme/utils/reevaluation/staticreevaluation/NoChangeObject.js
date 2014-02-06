dbm.registerClass("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	var NoChangeObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject::_init");
		
		this.superCall();
		
		this.reevaluationData = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference. Should be overridden.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	null
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		return aBaseObject;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationData = null;
		
		this.superCall();
	};
});