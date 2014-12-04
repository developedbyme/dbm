/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector", "dbm.utils.data.orderselector.SteppedOrderSelector", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector");
	//"use strict";
	
	var ModifiedSteppedOrderSelector = dbm.importClass("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector::_init");
		
		this.superCall();
		
		this._modifier = null;
		
		return this;
	};
	
	objectFunctions.setModifier = function(aModifier) {
		this._modifier = aModifier;
		
		return this;
	};
	
	objectFunctions.modifyStep = function(aStep) {
		var returnValue = this._modifier.interpolate(aStep);
		
		return Math.round(this._modifier.interpolate(aStep));
	};
	
	staticFunctions.create = function(aStartPosition, aEndPoistion, aModifier) {
		
		var numberOfSteps = Math.abs(aEndPoistion+aStartPosition);
		
		var newModifiedSteppedOrderSelector = (new ModifiedSteppedOrderSelector()).init();
		newModifiedSteppedOrderSelector.setup(aStartPosition, aEndPoistion, numberOfSteps);
		newModifiedSteppedOrderSelector.setModifier(aModifier);
		return newModifiedSteppedOrderSelector;
	};
});