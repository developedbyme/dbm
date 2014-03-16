/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.orderselector.OrderedOrderSelector", "com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.OrderedOrderSelector");
	//"use strict";
	
	var OrderedOrderSelector = dbm.importClass("com.developedbyme.utils.data.orderselector.OrderedOrderSelector");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.OrderedOrderSelector::_init");
		
		this.superCall();
		
		this._currentStep = 0;
		this._orderArray = new Array();
		
		return this;
	};
	
	objectFunctions.setCurrentStep = function(aStep) {
		this._currentStep = aStep;
		
		return this;
	};
	
	objectFunctions.setOrder = function(aOrderArray) {
		this._orderArray = aOrderArray;
		
		return this;
	};
	
	objectFunctions.getNextValue = function(aReservedData) {
		
		var currentArray = this._orderArray;
		var currentArrayLength = currentArray.length;
		
		while(this._currentStep < currentArrayLength) {
			var orderedStep = this._orderArray[this._currentStep];
			if(!aReservedData.isReserved(orderedStep)) {
				aReservedData.reserve(orderedStep);
				return orderedStep;
			}
			this._currentStep++;
		}
		
		return ClassReference.END_VALUE;
	};
	
	staticFunctions.create = function(aOrderArray) {
		
		var newOrderedOrderSelector = (new OrderedOrderSelector()).init();
		newOrderedOrderSelector.setOrder(aOrderArray);
		return newOrderedOrderSelector;
	};
});