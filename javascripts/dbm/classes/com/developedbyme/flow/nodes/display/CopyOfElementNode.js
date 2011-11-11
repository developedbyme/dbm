dbm.registerClass("com.developedbyme.flow.nodes.display.CopyOfElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.CopyOfElementNode");
	
	var CopyOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.CopyOfElementNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.CopyOfElementNode::init");
		
		this.superCall();
		
		this._inputElement = this.createProperty("inputElement", null);
		this._outputElement = this.createProperty("outputElement", null);
		
		this.createUpdateFunction("default", this._update, [this._inputElement], [this._outputElement]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.CopyOfElementNode::_update");
		
		var htmlElement = this._inputElement.getValueWithoutFlow();
		this._outputElement.setValueWithFlow(htmlElement.cloneNode(true), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputElement = null;
		this._outputElement = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputElement", aElement);
		return newNode;
	}
});