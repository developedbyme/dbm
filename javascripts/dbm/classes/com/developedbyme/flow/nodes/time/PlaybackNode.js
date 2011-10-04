dbm.registerClass("com.developedbyme.flow.nodes.time.PlaybackNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.time.PlaybackNode");
	
	var PlaybackNode = dbm.importClass("com.developedbyme.flow.nodes.time.PlaybackNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.time.PlaybackNode::init");
		
		this.superCall();
		
		this._inputTime = this.createProperty("inputTime", 0);
		this._outputTime = this.createProperty("outputTime", 0);
		
		this._minTime = this.createProperty("minTime", 0);
		this._maxTime = this.createProperty("maxTime", Infinity);
		
		this._state = this.createProperty("state", 0);
		this._loop = this.createProperty("loop", false);
		
		this._playbackSpeed = this.createProperty("playbackSpeed", 1);
		
		this.createUpdateFunction("default", this._update, [this._inputTime, this._minTime, this._maxTime, this._state, this._loop, this._playbackSpeed], [this._outputTime]);
		
		this._lastInputTime = 0;
		this._lastOutputTime = 0;
		
		return this;
	};
	
	objectFunctions.setupPlayback = function(aMinTime, aMaxTime, aLoop) {
		this._minTime.setValue(aMinTime);
		this._maxTime.setValue(aMaxTime);
		this._loop.setValue(aLoop);
		return this;
	};
	
	objectFunctions.play = function() {
		this._state.setValue(1);
		return this;
	};
	
	objectFunctions.pause = function() {
		this._state.setValue(0);
		return this;
	};
	
	objectFunctions.rewind = function() {
		this._lastOutputTime = 0;
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.time.PlaybackNode::_update");
		var inputTime = this._inputTime.getValueWithoutFlow();
		if(this._state.getValueWithoutFlow() == 1) {
			var timeDiff = inputTime-this._lastInputTime;
			var playbackSpeed = this._playbackSpeed.getValueWithoutFlow();
			var newTime = this._lastOutputTime+playbackSpeed*timeDiff;
			var minTime = this._minTime.getValueWithoutFlow();
			var maxTime = this._maxTime.getValueWithoutFlow();
			if(newTime > maxTime) {
				if(this._loop.getValueWithoutFlow()) {
					var times = Math.floor((newTime-minTime)/(maxTime-minTime));
					newTime -= times*(maxTime-minTime);
					this._outputTime.setValueWithFlow(newTime, aFlowUpdateNumber);
					this._lastOutputTime = newTime;
				}
				else {
					this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
					this._lastOutputTime = maxTime;
					this._state.setValue(0);
				}
			}
			else if(newTime < minTime) {
				if(this._loop.getValueWithoutFlow()) {
					var times = Math.floor((newTime-minTime)/(maxTime-minTime));
					newTime -= times*(maxTime-minTime);
					this._outputTime.setValueWithFlow(newTime, aFlowUpdateNumber);
					this._lastOutputTime = newTime;
				}
				else {
					this._outputTime.setValueWithFlow(minTime, aFlowUpdateNumber);
					this._lastOutputTime = minTime;
					this._state.setValue(0);
				}
			}
			else {
				this._outputTime.setValueWithFlow(newTime, aFlowUpdateNumber);
				this._lastOutputTime = newTime;
			}
		}
		else {
			this._outputTime.setValueWithFlow(this._lastOutputTime, aFlowUpdateNumber);
		}
		this._lastInputTime = inputTime;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputTime = null;
		this._outputTime = null;
		
		this._minTime = null;
		this._maxTime = null;
		
		this._state = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});