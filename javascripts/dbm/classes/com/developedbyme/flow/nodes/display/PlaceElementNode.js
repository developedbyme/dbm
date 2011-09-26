dbm.registerClass("com.developedbyme.flow.nodes.display.PlaceElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.PlaceElementNode::init");
		
		this.superCall();
		
		this._x = this.createProperty("x", null);
		this._y = this.createProperty("y", null);
		this._z = this.createProperty("z", null);
		this._width = this.createProperty("width", null);
		this._height = this.createProperty("height", null);
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._z, this._width, this._height, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.PlaceElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		htmlElement.style.setProperty("left", Math.round(this._x.getValueWithoutFlow()) + "px", "");
		htmlElement.style.setProperty("top", Math.round(this._y.getValueWithoutFlow()) + "px", "");
		htmlElement.style.setProperty("z-index", Math.round(this._z.getValueWithoutFlow()), "");
		htmlElement.style.setProperty("width", this._width.getValueWithoutFlow() + "px", "");
		htmlElement.style.setProperty("height", this._height.getValueWithoutFlow() + "px", "");
		
		this._display.setValueWithFlow(null, aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aX, aY, aZ, aWidth, aHeight) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	}
});