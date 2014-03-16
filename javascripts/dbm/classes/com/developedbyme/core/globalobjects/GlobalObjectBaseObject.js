/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.GlobalObjectBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject");
	//"use strict";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
});