/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.time.CurrentTimeNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.time.CurrentTimeNode");
	
	var CurrentTimeNode = dbm.importClass("dbm.flow.nodes.time.CurrentTimeNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.time.CurrentTimeNode::_init");
		
		this.superCall();
		
		this._time = this.createProperty("time", 0);
		
		return this;
	};
	
	objectFunctions.start = function() {
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.stop = function() {
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("dbm.flow.nodes.time.CurrentTimeNode::updateTime");
		//console.log(aTime);
		
		var currentTime = 0.001*Date.now();
		
		this._time.setValue(currentTime);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._time = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});