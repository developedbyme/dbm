dbm.registerClass("com.developedbyme.flow.nodes.canvas.DrawPatternNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.DrawPatternNode");
	
	var DrawPatternNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.DrawPatternNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawPatternNode::init");
		
		this.superCall();
		
		
		this._image = this.createProperty("image", null);
		this._image.setAlwaysUpdateFlow(true);
		this._repeatWidth = this.createProperty("repeatWidth", 0);
		this._repeatHeight = this.createProperty("repeatHeight", 0);
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._offsetX = this.createProperty("offsetX", 0);
		this._offsetY = this.createProperty("offsetY", 0);
		this._canvas = this.createProperty("canvas", document.createElement("canvas"));
		this._canvas.setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._image, this._repeatWidth, this._repeatHeight, this._width, this._height, this._offsetX, this._offsetY], [this._canvas]);
		
		return this;
	};
	
	objectFunctions.setImage = function(aImage) {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawPatternNode::_update");
		
		this._image.setValue(aImage);
		this._repeatWidth.setValue(aImage.width);
		this._repeatHeight.setValue(aImage.height);
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawPatternNode::_update");
		
		var imageWidth = this._repeatWidth.getValueWithoutFlow();
		var imageHeight = this._repeatHeight.getValueWithoutFlow();
		
		var offsetX = this._offsetX.getValueWithoutFlow();
		offsetX -= Math.ceil(offsetX/imageWidth)*imageWidth;
		var offsetY = this._offsetY.getValueWithoutFlow();
		offsetY -= Math.ceil(offsetY/imageHeight)*imageHeight;
		
		var canvas = this._canvas.getValueWithoutFlow();
		
		var currentPattern = canvas.getContext("2d").createPattern(this._image.getValueWithoutFlow(), "repeat");
		
		var renderWidth = this._width.getValueWithoutFlow();
		var renderHeight = this._height.getValueWithoutFlow();
		
		canvas.width = renderWidth;
		canvas.height = renderHeight;
		
		canvas.getContext("2d").clearRect(0, 0, renderWidth, renderHeight);
		canvas.getContext("2d").fillStyle = currentPattern;
		
		var timesX = Math.ceil((renderWidth-offsetX)/imageWidth);
		var timesY = Math.ceil((renderHeight-offsetY)/imageHeight);
		
		for(var x = 0; x < timesX; x++) {
			for(var y = 0; y < timesY; y++) {
				canvas.getContext("2d").drawImage(this._image.getValueWithoutFlow(), 0, 0, imageWidth, imageHeight, Math.round(offsetX+x*imageWidth), Math.round(offsetY+y*imageHeight), imageWidth, imageHeight);
			}
		}
		
		this._canvas.setValueWithFlow(canvas, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._pattern = null;
		this._repeatWidth = null;
		this._repeatHeight = null;
		this._width = null;
		this._height = null;
		this._offsetX = null;
		this._offsetY = null;
		this._canvas = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aImage, aWidth, aHeight, aOffsetX, aOffsetY) {
		var newNode = (new ClassReference()).init();
		newNode.setImage(aImage);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		newNode.setPropertyInputWithoutNull("offsetX", aOffsetX);
		newNode.setPropertyInputWithoutNull("offsetY", aOffsetY);
		return newNode;
	};
});