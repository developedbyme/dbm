dbm.registerClass("com.developedbyme.flow.nodes.display.SizeOfElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::init");
		
		this.superCall();
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._element = this.createProperty("element", null);
		
		this.createUpdateFunction("default", this._update, [this._element], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		this._width.setValueWithFlow(htmlElement.clientWidth, aFlowUpdateNumber);
		this._height.setValueWithFlow(htmlElement.clientHeight, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._element = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	}
});