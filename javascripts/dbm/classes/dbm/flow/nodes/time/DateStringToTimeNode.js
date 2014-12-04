/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.time.DateStringToTimeNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.time.DateStringToTimeNode");
	
	var DateStringToTimeNode = dbm.importClass("dbm.flow.nodes.time.DateStringToTimeNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.time.DateStringToTimeNode::_init");
		
		this.superCall();
		
		this._string = this.createProperty("string", "");
		
		this._time = this.createProperty("time", 0);
		
		this.createUpdateFunction("default", this._update, [this._string], [this._time]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.time.DateStringToTimeNode::_update");
		
		var currentString = this._string.getValueWithoutFlow();
		//var currentDate = new Date(currentString); //MENOTE: not implemented in safari
		
		
		var tempArray = currentString.split("T");
		var dateArray = tempArray[0].split("-");
		var timeString = tempArray[1];
		var timeArray = timeString.substring(0, 8).split(":");
		var currentDate = new Date();
		currentDate.setUTCFullYear(parseInt(dateArray[0], 10));
		currentDate.setUTCMonth(parseInt(dateArray[1], 10)-1);
		currentDate.setUTCDate(parseInt(dateArray[2], 10));
		currentDate.setUTCHours(parseInt(timeArray[0], 10));
		currentDate.setUTCMinutes(parseInt(timeArray[1], 10));
		currentDate.setUTCSeconds(parseInt(timeArray[2], 10));
		currentDate.setUTCMilliseconds(0);
		
		var timeZoneHours = timeString.substring(9, 11);
		var timeZoneMinutes = timeString.substring(11, 13);
		
		var timeZoneOffset = 1000*60*(60*parseInt(timeZoneHours, 10)+parseInt(timeZoneMinutes, 10));
		
		if(tempArray[1].charAt(8) === "+") {
			timeZoneOffset *= -1;
		}
		currentDate = new Date(currentDate.valueOf()+timeZoneOffset);
		
		var currentTime = 0.001*currentDate.valueOf();
		
		this._time.setValueWithFlow(currentTime, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._string = null;
		this._time = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aString) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInput("string", aString);
		return newNode;
	};
});