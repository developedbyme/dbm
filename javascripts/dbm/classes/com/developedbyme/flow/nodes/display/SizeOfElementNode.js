dbm.registerClass("com.developedbyme.flow.nodes.display.SizeOfElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var WindowForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowForElementNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::init");
		
		this.superCall();
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._element = this.createProperty("element", null);
		
		this._windowForElementNode = WindowForElementNode.create(this._element);
		this.addDestroyableObject(this._windowForElementNode);
		var windowSizeNode = WindowSizeNode.create(this._windowForElementNode.getProperty("window"));
		this.addDestroyableObject(windowSizeNode);
		
		this.createUpdateFunction("default", this._update, [this._element, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height")], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.setDocumentInput = function(aProperty) {
		
		this._windowForElementNode.setPropertyInput("document", aProperty);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement != null) {
			this._width.setValueWithFlow(htmlElement.clientWidth, aFlowUpdateNumber);
			this._height.setValueWithFlow(htmlElement.clientHeight, aFlowUpdateNumber);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._element = null;
		this._document = null;
		this._windowForElementNode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInput("element", aElement);
		return newNode;
	}
});