dbm.registerClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.ArrayHolder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		//MENOTE: should be overridden
		//METODO: error message
		return null;
	};
	
	/**
	 * The function that reevalutes this reference. Should be overridden.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	null
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		//MENOTE: should be overridden
		
		return null;
	}; //End function reevaluate
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});