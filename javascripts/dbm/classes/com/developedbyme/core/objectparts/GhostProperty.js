dbm.registerClass("com.developedbyme.core.objectparts.GhostProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.GhostProperty");
	
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setValue = function(aValue) {
		
	};
	
	objectFunctions.setValue = function(aValue) {
		
	};
	
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::setValueWithFlow");
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions.getValue = function() {
		return null;
	};
	
	objectFunctions.getValueWithoutFlow = function() {
		return null;
	};
	
	objectFunctions.updateFlow = function() {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::updateFlow");
		this._status = FlowStatusTypes.UPDATED;
	};
	
	staticFunctions.create = function(aObjectInput) {
		var newGhostProperty = (new GhostProperty()).init();
		return newGhostProperty;
	};
	
});