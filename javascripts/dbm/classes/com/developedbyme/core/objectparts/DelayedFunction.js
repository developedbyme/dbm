dbm.registerClass("com.developedbyme.core.objectparts.DelayedFunction", "com.developedbyme.core.objectparts.ExtendedFunctionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.DelayedFunction");
	
	var DelayedFunction = dbm.importClass("com.developedbyme.core.objectparts.DelayedFunction");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.DelayedFunction::init");
		
		this.superCall();
		
		this._function = null;
		
		this._argumentsArray = null;
		this._triggerTime = 0;
		this._delayLength = 0;
		this._hasCall = false;
		
		return this;
	};
	
	objectFunctions.setFunction = function(aFunction) {
		//console.log("com.developedbyme.core.objectparts.DelayedFunction::setDefaultFunction");
		
		this._function = aFunction;
		
		return this;
	};
	
	objectFunctions.setDelayLength = function(aLength) {
		//console.log("com.developedbyme.core.objectparts.DelayedFunction::setDelayLength");
		
		this._delayLength = aLength;
		
		return this;
	};
	
	objectFunctions.callFunction = function(aArguments) {
		//console.log("com.developedbyme.core.objectparts.DelayedFunction::callFunction");
		//console.log(this._canRunFunction(), this._function);
		
		this._argumentsArray = aArguments;
		
		if(!this._hasCall) {
			dbm.singletons.dbmUpdateManager.addUpdater(this, "default");
		}
		this._hasCall = true;
		this._triggerTime = dbm.singletons.dbmUpdateManager.currentTime+this._delayLength;
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		//console.log("com.developedbyme.core.objectparts.DelayedFunction::_performCallFunction");
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
	}
});