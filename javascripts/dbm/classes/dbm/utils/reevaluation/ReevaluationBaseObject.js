/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for all reevaluation objects. Implements the reevaluate() interface.
 */
dbm.registerClass("dbm.utils.reevaluation.ReevaluationBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	//Self reference
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.ArrayHolder::_init");
		
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
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The result of the reevaluation.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		//MENOTE: should be overridden
		
		return null;
	}; //End function reevaluate
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});