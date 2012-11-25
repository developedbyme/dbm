dbm.registerClass("com.developedbyme.flow.nodes.debug.ReportNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.debug.ReportNode::_init");
		
		this.superCall();
		
		this._type = this.createProperty("type", ReportTypes.LOG);
		this._level = this.createProperty("level", ReportTypes.LEVEL);
		this._text = this.createProperty("text", null);
		this._print = this.createGhostProperty("print");
		
		this.createUpdateFunction("default", this._update, [this._type, this._level, this._text], [this._print]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		
		var type = this._type.getValueWithoutFlow();
		var level = this._level.getValueWithoutFlow();
		var text = this._text.getValueWithoutFlow();
		
		ErrorManager.getInstance().report(type, level, this, "update", text);
		
	};
	
	objectFunctions.start = function() {
		
		this._print.startUpdating();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		
		this._print.stopUpdating();
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._numberOfErrors = null;
		this._numberOfWarnings = null;
		this._numberOfLogs = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aText) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("text", aText);
		return newNode;
	};
});