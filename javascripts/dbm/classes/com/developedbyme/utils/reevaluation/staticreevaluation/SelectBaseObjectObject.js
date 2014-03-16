/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject::_init");
		
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
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationData = null;
		
		this.superCall();
	};
});