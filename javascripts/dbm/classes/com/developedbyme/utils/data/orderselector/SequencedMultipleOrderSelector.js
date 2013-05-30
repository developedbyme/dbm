dbm.registerClass("com.developedbyme.utils.data.orderselector.SequencedMultipleOrderSelector", "com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.SequencedMultipleOrderSelector");
	//"use strict";
	
	var SequencedMultipleOrderSelector = dbm.importClass("com.developedbyme.utils.data.orderselector.SequencedMultipleOrderSelector");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.SequencedMultipleOrderSelector::_init");
		
		this.superCall();
		
		this._currentStep = 0;
		this._orderSelectorsArray = new Array();
		
		return this;
	};
	
	objectFunctions.setCurrentStep = function(aStep) {
		this._currentStep = aStep;
		
		return this;
	};
	
	objectFunctions.setOrderSelectors = function(aOrderSelectors) {
		this._orderSelectorsArray = aOrderSelectors;
		
		return this;
	};
	
	objectFunctions.getNextValue = function(aReservedData) {
		
		var currentArray = this._orderSelectorsArray;
		var currentArrayLength = currentArray.length;
		var endStep = this._currentStep+currentArrayLength;
		
		for(var i = this._currentStep; i < endStep; i++) {
			var inRangeIndex = i % currentArrayLength;
			var currentSelector = currentArray[inRangeIndex];
			var returnValue = currentSelector.getNextValue(aReservedData);
			if(returnValue != -1) {
				this._currentStep = inRangeIndex+1;
				return returnValue;
			}
		}
		
		return ClassReference.END_VALUE;
	};
	
	staticFunctions.create = function(aOrderSelectors) {
		
		var newSequencedMultipleOrderSelector = (new SequencedMultipleOrderSelector()).init();
		newSequencedMultipleOrderSelector.setOrderSelectors(aOrderSelectors);
		return newSequencedMultipleOrderSelector;
	};
});