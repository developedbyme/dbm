/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.orderselector.SteppedOrderSelector", "com.developedbyme.utils.data.orderselector.OrderSelectorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.SteppedOrderSelector");
	//"use strict";
	
	var SteppedOrderSelector = dbm.importClass("com.developedbyme.utils.data.orderselector.SteppedOrderSelector");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.SteppedOrderSelector::_init");
		
		this.superCall();
		
		this._currentStep = 0;
		this._startPosition = 0;
		this._endPositions = 0;
		this._numberOfSteps = 0;
		
		return this;
	};
	
	objectFunctions.setCurrentStep = function(aStep) {
		this._currentStep = aStep;
		
		return this;
	};
	
	objectFunctions.setup = function(aStartPosition, aEndPoistion, aNumberOfSteps) {
		this._startPosition = aStartPosition;
		this._endPositions = aEndPoistion;
		this._numberOfSteps = aNumberOfSteps;
		
		return this;
	};
	
	objectFunctions.modifyStep = function(aStep) {
		//MENOTE: This function id for classes that extends this
		return aStep;
	};
	
	objectFunctions.getNextValue = function(aReservedData) {
		//console.log("com.developedbyme.utils.data.orderselector.SteppedOrderSelector::getNextValue");
		//console.log(aReservedData);
		
		while(this._currentStep < this._numberOfSteps) {
			var modifiedStep = this.modifyStep(this._currentStep);
			if(!aReservedData.isReserved(modifiedStep)) {
				aReservedData.reserve(modifiedStep);
				return modifiedStep;
			}
			this._currentStep++;
		}
		
		return ClassReference.END_VALUE;
	};
	
	staticFunctions.create = function(aStartPosition, aEndPoistion) {
		
		var numberOfSteps = Math.abs(aEndPoistion+aStartPosition);
		
		var newSteppedOrderSelector = (new SteppedOrderSelector()).init();
		newSteppedOrderSelector.setup(aStartPosition, aEndPoistion, numberOfSteps);
		return newSteppedOrderSelector;
	};
});