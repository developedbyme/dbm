dbm.registerClass("com.developedbyme.core.globalobjects.GlobalObjectBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject");
	//"use strict";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
});