dbm.registerClass("com.developedbyme.flow.nodes.display.PrintTextNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.PrintTextNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.PrintTextNode::init");
		
		this.superCall();
		
		this._text = this.createProperty("text", "");
		this._element = this.createProperty("element", document.body);
		this._display = this.createProperty("display", null);
		
		this.createUpdateFunction("default", this._update, [this._text, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.PrintTextNode::_update");
		this._element.getValueWithoutFlow().innerHTML = this._text.getValueWithoutFlow();
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