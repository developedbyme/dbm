dbm.registerClass("com.developedbyme.flow.nodes.display.SizeOfElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::init");
		
		this.superCall();
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._windowWidth = this.createProperty("windowWidth", 0);
		this._windowHeight = this.createProperty("windowHeight", 0);
		this._element = this.createProperty("element", null);
		
		this.createUpdateFunction("default", this._update, [this._element, this._windowWidth,this._windowHeight], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("com.developedbyme.flow.nodes.display.SizeOfElementNode::setElement");
		
		this._element.setValue(aElement);
		
		var currentWindow = dbm.singletons.dbmWindowManager.getWindowForDocument(aElement.ownerDocument);
		
		if(currentWindow != null) {
			this._windowWidth.connectInput(currentWindow.getProperty("width"));
			this._windowHeight.connectInput(currentWindow.getProperty("height"));
		}
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
		this._windowWidth = null;
		this._windowHeight = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		if(aElement != null) {
			newNode.setElement();
		}
		return newNode;
	}
});