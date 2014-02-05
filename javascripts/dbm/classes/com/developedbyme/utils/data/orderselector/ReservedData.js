dbm.registerClass("com.developedbyme.utils.data.orderselector.ReservedData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.ReservedData");
	//"use strict";
	
	var ReservedData = dbm.importClass("com.developedbyme.utils.data.orderselector.ReservedData");
	
	staticFunctions.END_VALUE = -1;
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.ReservedData::_init");
		
		this.superCall();
		this._array = new Array();
		
		return this;
	};
	
	objectFunctions.setLength = function(aLength) {
		this._array = new Array(aLength);
		
		return this;
	};
	
	objectFunctions.isReserved = function(aIndex) {
		return (this._array[aIndex] === 1);
	};
	
	objectFunctions.reserve = function(aIndex) {
		this._array[aIndex] = 1;
	};
	
	staticFunctions.create = function(aLength) {
		var newReservedData = (new ReservedData()).init();
		newReservedData.setLength(aLength);
		return newReservedData;
	};
});