dbm.registerClass("com.developedbyme.flow.nodes.time.CurrentTimeNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.time.CurrentTimeNode::_init");
		
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
		//console.log("com.developedbyme.flow.nodes.time.CurrentTimeNode::updateTime");
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