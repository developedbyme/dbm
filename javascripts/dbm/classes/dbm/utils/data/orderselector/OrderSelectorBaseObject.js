/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.orderselector.OrderSelectorBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.orderselector.OrderSelectorBaseObject");
	//"use strict";
	
	var OrderSelectorBaseObject = dbm.importClass("dbm.utils.data.orderselector.OrderSelectorBaseObject");
	
	staticFunctions.END_VALUE = -1;
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.orderselector.OrderSelectorBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.getNextValue = function(aReservedData) {
		
		//MENOTE: should be overridden
		
		return ClassReference.END_VALUE;
	};
});