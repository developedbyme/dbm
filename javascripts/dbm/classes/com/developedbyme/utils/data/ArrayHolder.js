/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.ArrayHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.ArrayHolder");
	//"use strict";
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.ArrayHolder::_init");
		
		this.superCall();
		
		this.array = new Array();
		this.ownsObjects = false;
		
		return this;
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this.ownsObjects) {
			ClassReference.destroyArrayIfExists(this.array);
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.array = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "array":
				return this.ownsObjects;
		}
		return this.superCall();
	};
	
	/**
	 * Creates a new holder
	 */
	staticFunctions.create = function(aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.create");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	}; //End function create
	
	/**
	 * Creates anew holder from array
	 */
	staticFunctions.createFromArray = function(aArray, aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.createFromArray");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.array = aArray;
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	}; //End function createFromArray
});