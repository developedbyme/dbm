/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Self reference
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Contructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject::_init");
		
		this.superCall();
		
		this.reevaluationData = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	Any	The object to base the reevaluation from.
	 *
	 * @return	Any	The base object
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
	
	staticFunctions.createCommand = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});