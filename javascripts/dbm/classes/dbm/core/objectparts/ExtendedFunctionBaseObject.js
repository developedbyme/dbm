/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.objectparts.ExtendedFunctionBaseObject", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.ExtendedFunctionBaseObject");
	//"use strict";
	
	var ExtendedFunctionBaseObject = dbm.importClass("dbm.core.objectparts.ExtendedFunctionBaseObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.ExtendedFunctionBaseObject::_init");
		
		this.superCall();
		
		this._isLocked = false;
		
		this._owner = null;
		
		return this;
	};
	
	objectFunctions.setOwner = function(aOwner) {
		
		this._owner = aOwner;
		
		return this;
	};
	
	objectFunctions.callFunction = function(aArguments) {
		if(this._isLocked) {
			//METODO: error message
			return;
		}
		return this._performCallFunction(aArguments);
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.lock = function() {
		this._isLocked = true;
	};
	
	objectFunctions.unlock = function() {
		this._isLocked = false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._owner = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_owner":
				return false;
		}
		return this.superCall();
	};
});