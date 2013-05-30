dbm.registerClass("com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject");
	//"use strict";
	
	var OrderSelectorBaseObject = dbm.importClass("com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject");
	
	staticFunctions.END_VALUE = -1;
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.getNextValue = function(aReservedData) {
		
		//MENOTE: should be overridden
		
		return ClassReference.END_VALUE;
	};
});