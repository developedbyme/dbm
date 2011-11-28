dbm.registerClass("com.developedbyme.flow.nodes.canvas.TextWidthWithCustomSpacingNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.TextWidthWithCustomSpacingNode");
	
	var TextWidthWithCustomSpacingNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.TextWidthWithCustomSpacingNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.TextWidthWithCustomSpacingNode::init");
		
		this.superCall();
		
		this._canvas = this.createProperty("canvas", dbm.singletons.dbmHtmlDomManager.getTempCanvas());
		this._text = this.createProperty("text", null);
		this._font = this.createProperty("font", null);
		this._spacing = this.createProperty("spacing", 0);
		this._width = this.createProperty("width", null);
		
		this.createUpdateFunction("default", this._update, [this._text, this._font, this._spacing, this._canvas], [this._width]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.TextWidthWithCustomSpacingNode::_update");
		
		var canvasContext = this._canvas.getValueWithoutFlow().getContext("2d");
		
		canvasContext.font = this._font.getValueWithoutFlow();
		
		var text = this._text.getValueWithoutFlow();
		var spacing = this._spacing.getValueWithoutFlow();
		
		var textWidth = 0;
		
		var currentArray = text.split("");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCharacter = currentArray[i];
			var currentCharacterWidth = canvasContext.measureText(currentCharacter).width;
			textWidth += currentCharacterWidth;
		}
		
		if(textWidth == 0) {
			return;
		}
		
		textWidth += spacing*Math.max(0, (currentArray.length-1));
		
		this._width.setValueWithFlow(textWidth, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._canvas = null;
		this._text = null;
		this._width = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aText, aFont, aSpacing, aCanvas) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("text", aText);
		newNode.setPropertyInputWithoutNull("font", aFont);
		newNode.setPropertyInputWithoutNull("spacing", aSpacing);
		newNode.setPropertyInputWithoutNull("canvas", aCanvas);
		return newNode;
	};
});