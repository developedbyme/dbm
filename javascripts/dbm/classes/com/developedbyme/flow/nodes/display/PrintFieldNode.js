dbm.registerClass("com.developedbyme.flow.nodes.display.PrintFieldNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.PrintFieldNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.PrintFieldNode::init");
		
		this.superCall();
		
		this._text = this.createProperty("text", "");
		this._element = this.createProperty("element", null);
		this._display = this.createProperty("display", null);
		
		this.createUpdateFunction("default", this._update, [this._text, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.PrintFieldNode::_update");
		this._element.getValueWithoutFlow().value = this._text.getValueWithoutFlow();
		this._display.setValueWithFlow(null, aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aText) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("text", aText);
		return newNode;
	}
});