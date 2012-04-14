dbm.registerClass("com.developedbyme.flow.nodes.canvas.webgl.CreateUint16ArrayNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateUint16ArrayNode");
	
	var CreateUint16ArrayNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.webgl.CreateUint16ArrayNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateUint16ArrayNode::init");
		
		this.superCall();
		
		this._inputArray = this.createProperty("inputArray", null);
		this._inputArray.setAlwaysUpdateFlow(true);
		this._outputArray = this.createProperty("outputArray", null);
		
		this.createUpdateFunction("default", this._update, [this._inputArray], [this._outputArray]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateUint16ArrayNode::_update");
		
		this._inputArray.setValueWithFlow(new Uint16Array(this._outputArray.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputArray = null;
		this._outputArray = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputArray) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputArray", aInputArray);
		return newNode;
	};
});