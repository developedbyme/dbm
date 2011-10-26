/**
 * A text with custom spacing in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasTextWithCustomSpacingGraphics2d", "com.developedbyme.utils.canvas.CanvasTextGraphics2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasTextWithCustomSpacingGraphics2d");
	
	var CanvasTextWithCustomSpacingGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasTextWithCustomSpacingGraphics2d");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var LineCapTypes = dbm.importClass("com.developedbyme.constants.LineCapTypes");
	var LineJoinTypes = dbm.importClass("com.developedbyme.constants.LineJoinTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasTextWithCustomSpacingGraphics2d::init");
		
		this.superCall();
		
		this._spacing = this.createProperty("spacing", 0);
		this._updateFunctions.getObject("textWidth").addInputConnection(this._spacing);
		this._graphicsUpdate.connectInput(this._spacing);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		
		aContext.save();
		
		aContext.font = this._font.getValue();
		aContext.textAlign = this._align.getValue(); //METODO: implement this
		aContext.textBaseline = this._baseline.getValue();
		
		aContext.lineWidth = this._lineWidth.getValue();
		aContext.lineCap = this._lineCap.getValue();
		aContext.lineJoin = this._lineJoin.getValue();
		aContext.miterLimit = this._miterLimit.getValue();
		
		var text = this._text.getValue();
		var x = this._x.getValue();
		var y = this._y.getValue();
		var spacing = this._spacing.getValue();
		var maxWidth = this._maxWidth.getValue(); //METODO: implement this
		var strokeStyle = this._strokeStyle.getValue();
		var fillStyle = this._fillStyle.getValue();
		
		var currentArray = text.split("");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCharacter = currentArray[i];
			var currentCharacterWidth = aContext.measureText(currentCharacter).width;
			
			if(this._strokeOverFill) {
				this._fillText(aContext, fillStyle, currentCharacter, x, y, maxWidth);
				this._strokeText(aContext, strokeStyle, currentCharacter, x, y, maxWidth);
			}
			else {
				this._strokeText(aContext, strokeStyle, currentCharacter, x, y, maxWidth);
				this._fillText(aContext, fillStyle, currentCharacter, x, y, maxWidth);
			}
			
			x += currentCharacterWidth+spacing;
		}
		
		aContext.restore();
	};
	
	objectFunctions._updateTextWidthFlow = function(aFlowUpdateNumber) {
		
		canvasContext = dbm.singletons.dbmHtmlDomManager.getTempCanvas().getContext("2d");
		canvasContext.font = this._font.getValueWithoutFlow();
		
		var textWidth = 0;
		
		var text = this._text.getValueWithoutFlow();
		var spacing = this._spacing.getValueWithoutFlow();
		
		var currentArray = text.split("");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCharacter = currentArray[i];
			var currentCharacterWidth = canvasContext.measureText(currentCharacter).width;
			textWidth += currentCharacterWidth;
		}
		
		textWidth += spacing*Math.max(0, (currentArray.length-1));
		
		this._textWidth.setValueWithFlow(textWidth, aFlowUpdateNumber);
	};
	
	staticFunctions.create = function(aText, aSpacing) {
		var newCanvasTextWithCustomSpacingGraphics2d = (new ClassReference()).init();
		
		newCanvasTextWithCustomSpacingGraphics2d.setPropertyInput("text", aText);
		newCanvasTextWithCustomSpacingGraphics2d.setPropertyInputWithoutNull("spacing", aSpacing);
		
		return newCanvasTextWithCustomSpacingGraphics2d;
	};
});