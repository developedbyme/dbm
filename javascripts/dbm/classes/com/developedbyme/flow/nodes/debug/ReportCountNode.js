dbm.registerClass("com.developedbyme.flow.nodes.debug.ReportCountNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.debug.ReportCountNode");
	
	var ReportCountNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportCountNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.debug.ReportCountNode::_init");
		
		this.superCall();
		
		this._numberOfErrors = this.createProperty("numberOfErrors", 0);
		this._numberOfWarnings = this.createProperty("numberOfWarnings", 0);
		this._numberOfLogs = this.createProperty("numberOfLogs", 0);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._numberOfErrors = null;
		this._numberOfWarnings = null;
		this._numberOfLogs = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});