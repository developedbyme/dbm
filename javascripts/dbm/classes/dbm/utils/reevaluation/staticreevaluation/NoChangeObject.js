/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.staticreevaluation.NoChangeObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	var NoChangeObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.staticreevaluation.NoChangeObject::_init");
		
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