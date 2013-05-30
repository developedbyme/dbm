dbm.registerClass("com.developedbyme.utils.data.orderselector.ModifiedSteppedOrderSelector", "com.developedbyme.utils.data.orderselector.SteppedOrderSelector", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.orderselector.ModifiedSteppedOrderSelector");
	//"use strict";
	
	var ModifiedSteppedOrderSelector = dbm.importClass("com.developedbyme.utils.data.orderselector.ModifiedSteppedOrderSelector");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.orderselector.ModifiedSteppedOrderSelector::_init");
		
		this.superCall();
		
		this._modifier = null;
		
		return this;
	};
	
	objectFunctions.setModifier = function(aModifier) {
		this._modifier = aModifier;
		
		return this;
	};
	
	objectFunctions.modifyStep = function(aStep) {
		return this._modifier.interpolate(aStep);
	};
	
	staticFunctions.create = function(aStartPosition, aEndPoistion, aModifier) {
		
		var numberOfSteps = Math.abs(aEndPoistion+aStartPosition);
		
		var newModifiedSteppedOrderSelector = (new ModifiedSteppedOrderSelector()).init();
		newModifiedSteppedOrderSelector.setup(aStartPosition, aEndPoistion, aNumberOfSteps);
		newModifiedSteppedOrderSelector.setModifier(aModifier);
		return newModifiedSteppedOrderSelector;
	};
});