dbm.registerClass("com.developedbyme.core.globalobjects.GlobalObjectBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.GlobalObjectBaseObject::init");
		
		this.superCall();
		
		return this;
	};
});