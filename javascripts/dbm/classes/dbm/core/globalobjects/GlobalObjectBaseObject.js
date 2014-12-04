/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for all global object singletons.
 */
dbm.registerClass("dbm.core.globalobjects.GlobalObjectBaseObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.GlobalObjectBaseObject");
	//"use strict";
	
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.GlobalObjectBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Interface function for adding random values to an initial seed array.
	 *
	 * @param	aValuesArray	Array	The array to fill with values.
	 *
	 * @return	self
	 */
	objectFunctions.addToSharedRandomValues = function(aValuesArray) {
		//console.log("dbm.core.globalobjects.GlobalObjectBaseObject::addToSharedRandomValues");
		
		//MENOTE: should be overridden
		
		return this;
	};
});