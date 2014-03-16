/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.ExtendedFunction", "com.developedbyme.core.objectparts.ExtendedFunctionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedFunction");
	//"use strict";
	
	var ExtendedFunction = dbm.importClass("com.developedbyme.core.objectparts.ExtendedFunction");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedFunction::_init");
		
		this.superCall();
		
		this._function = null;
		
		return this;
	};
	
	objectFunctions.setFunction = function(aFunction) {
		
		this._function = aFunction;
		
		return this;
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		return this._function.apply(this._owner, aArguments);
	};
	
	staticFunctions.create = function(aOwner, aFunction) {
		var newFunction = (new ExtendedFunction()).init().setOwner(aOwner);
		newFunction.setFunction(aFunction);
		return newFunction;
	};
});