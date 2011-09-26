dbm.registerClass("com.developedbyme.core.objectparts.ExtendedFunctionBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedFunctionBaseObject");
	
	var ExtendedFunctionBaseObject = dbm.importClass("com.developedbyme.core.objectparts.ExtendedFunctionBaseObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedFunctionBaseObject::init");
		
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
});