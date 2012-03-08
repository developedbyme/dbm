dbm.registerClass("com.developedbyme.flow.nodes.time.GlobalTimeNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.time.GlobalTimeNode::_init");
		
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
		//console.log("com.developedbyme.flow.nodes.time.GlobalTimeNode::updateTime");
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