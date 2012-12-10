dbm.registerClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.time.DateStringToTimeNode::_init");
		
		this.superCall();
		
		this._string = this.createProperty("string", "");
		
		this._time = this.createProperty("time", 0);
		
		this.createUpdateFunction("default", this._update, [this._string], [this._time]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.time.DateStringToTimeNode::_update");
		
		var currentTime = 0.001*(new Date(this._string.getValueWithoutFlow())).valueOf();
		
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