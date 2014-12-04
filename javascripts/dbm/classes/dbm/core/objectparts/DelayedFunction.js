/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.objectparts.DelayedFunction", "dbm.core.objectparts.ExtendedFunctionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.DelayedFunction");
	//"use strict";
	
	var DelayedFunction = dbm.importClass("dbm.core.objectparts.DelayedFunction");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.DelayedFunction::_init");
		
		this.superCall();
		
		this._function = null;
		
		this._argumentsArray = null;
		this._triggerTime = 0;
		this._delayLength = 0;
		this._hasCall = false;
		
		return this;
	};
	
	objectFunctions.setFunction = function(aFunction) {
		//console.log("dbm.core.objectparts.DelayedFunction::setDefaultFunction");
		
		this._function = aFunction;
		
		return this;
	};
	
	objectFunctions.setDelayLength = function(aLength) {
		//console.log("dbm.core.objectparts.DelayedFunction::setDelayLength");
		
		this._delayLength = aLength;
		
		return this;
	};
	
	objectFunctions.callFunction = function(aArguments) {
		//console.log("dbm.core.objectparts.DelayedFunction::callFunction");
		//console.log(this._canRunFunction(), this._function);
		
		this._argumentsArray = aArguments;
		
		if(!this._hasCall) {
			dbm.singletons.dbmUpdateManager.addUpdater(this, "default");
		}
		this._hasCall = true;
		this._triggerTime = dbm.singletons.dbmUpdateManager.currentTime+this._delayLength;
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		//console.log("dbm.core.objectparts.DelayedFunction::_performCallFunction");
		return this._function.apply(this._owner, aArguments);
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		
		if(aTime >= this._triggerTime) {
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "default");
			this._hasCall = false;
			this._performCallFunction(this._argumentsArray);
			this._argumentsArray = null;
		}
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._hasCall) {
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "default");
			this._hasCall = false;
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._function = null;
		this._argumentsArray = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwner, aFunction, aDelayLength) {
		var newFunction = (new DelayedFunction()).init().setOwner(aOwner).setFunction(aFunction).setDelayLength(aDelayLength);
		return newFunction;
	};
});