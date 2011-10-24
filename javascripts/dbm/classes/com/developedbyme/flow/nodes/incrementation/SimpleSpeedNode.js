dbm.registerClass("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode");
	
	var SimpleSpeedNode = dbm.importClass("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode::init");
		
		this.superCall();
		
		this._originalPosition = this.createProperty("originalPosition", 0);
		this._length = this.createProperty("length", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		this._lastTime = this.createProperty("lastTime", 0);
		this._time = this.createProperty("time", 0);
		this._speed = this.createProperty("speed", 1);
		
		this.createUpdateFunction("default", this._update, [this._originalPosition, this._length, this._lastTime, this._time, this._speed], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode::_update");
		
		var timeDifference = this._time.getValueWithoutFlow()-this._lastTime.getValueWithoutFlow();
		
		var newLength = timeDifference*this._speed.getValueWithoutFlow()+this._length.getValueWithoutFlow();
		
		this._length.setValueWithFlow(newLength, aFlowUpdateNumber);
		this._lastTime.setValueWithFlow(this._time.getValueWithoutFlow(), aFlowUpdateNumber);
		this._outputValue.setValueWithFlow(this._originalPosition.getValueWithoutFlow()+newLength, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._originalPosition = null;
		this._length = null;
		this._outputValue = null;
		this._lastTime = null;
		this._time = null;
		this._speed = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTime, aOriginalPosition, aSpeed) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("time", aTime);
		newNode.setPropertyInputWithoutNull("originalPosition", aOriginalPosition);
		newNode.setPropertyInputWithoutNull("speed", aSpeed);
		return newNode;
	}
});