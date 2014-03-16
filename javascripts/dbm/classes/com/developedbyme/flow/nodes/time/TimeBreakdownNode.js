/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.time.TimeBreakdownNode::_init");
		
		this.superCall();
		
		this._time = this.createProperty("time", 0);
		
		this._hours = this.createProperty("hours", 0);
		this._minutes = this.createProperty("minutes", 0);
		this._seconds = this.createProperty("seconds", 0);
		this._milliseconds = this.createProperty("milliseconds", 0);
		
		this.createUpdateFunction("default", this._update, [this._time], [this._hours, this._minutes, this._seconds, this._milliseconds]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.time.TimeBreakdownNode::_update");
		
		var currentTime = this._time.getValueWithoutFlow()*1000;
		
		var currentMilliseconds = currentTime%1000;
		currentTime = (currentTime-currentMilliseconds)/1000;
		
		var currentSeconds = currentTime%60;
		currentTime = (currentTime-currentSeconds)/60;
		
		var currentMinutes = currentTime%60;
		currentTime = (currentTime-currentMinutes)/60;
		
		var currentHours = currentTime;
		
		this._hours.setValueWithFlow(currentHours, aFlowUpdateNumber);
		this._minutes.setValueWithFlow(currentMinutes, aFlowUpdateNumber);
		this._seconds.setValueWithFlow(currentSeconds, aFlowUpdateNumber);
		this._milliseconds.setValueWithFlow(currentMilliseconds, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._time = null;
		
		this._hours = null;
		this._minutes = null;
		this._seconds = null;
		this._milliseconds = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTime) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInput("time", aTime);
		return newNode;
	};
});