/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.time.GlobalTimeNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.time.GlobalTimeNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.time.GlobalTimeNode::_init");
		
		this.superCall();
		
		this._time = this.createProperty("time", 0);
		this._frame = this.createProperty("frame", 0);
		
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
		//console.log("dbm.flow.nodes.time.GlobalTimeNode::updateTime");
		//console.log(aTime);
		this._time.setValue(aTime);
		this._frame.setValue(aFrame);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});