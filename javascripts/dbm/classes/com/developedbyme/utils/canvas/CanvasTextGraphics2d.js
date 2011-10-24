/**
 * A text in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasTextGraphics2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasTextGraphics2d");
	
	var CanvasTextGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasTextGraphics2d");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var LineCapTypes = dbm.importClass("com.developedbyme.constants.LineCapTypes");
	var LineJoinTypes = dbm.importClass("com.developedbyme.constants.LineJoinTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasTextGraphics2d::init");
		
		this.superCall();
		
		this._font = this.createProperty("font", null);
		this._align = this.createProperty("align", "start");
		this._baseline = this.createProperty("baseline", "alphabetic");
		this._text = this.createProperty("text", null);
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._maxWidth = this.createProperty("maxWidth", null);
		this._fillStyle = this.createProperty("fillStyle", null);
		this._lineWidth = this.createProperty("lineWidth", 1);
		this._lineCap = this.createProperty("lineCap", LineCapTypes.BUTT);
		this._lineJoin = this.createProperty("lineJoin", LineJoinTypes.MITER);
		this._miterLimit = this.createProperty("miterLimit", 10);
		this._strokeStyle = this.createProperty("strokeStyle", null);
		
		this._strokeOverFill = true;
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._font);
		this._graphicsUpdate.connectInput(this._align);
		this._graphicsUpdate.connectInput(this._baseline);
		this._graphicsUpdate.connectInput(this._text);
		this._graphicsUpdate.connectInput(this._x);
		this._graphicsUpdate.connectInput(this._y);
		this._graphicsUpdate.connectInput(this._maxWidth);
		this._graphicsUpdate.connectInput(this._fillStyle);
		this._graphicsUpdate.connectInput(this._lineWidth);
		this._graphicsUpdate.connectInput(this._lineCap);
		this._graphicsUpdate.connectInput(this._lineJoin);
		this._graphicsUpdate.connectInput(this._miterLimit);
		this._graphicsUpdate.connectInput(this._strokeStyle);
		
		return this;
	};
	
	objectFunctions.setImage = function(aImage) {
		
		this._image.setValue(aImage)
		
		this._sourceWidth.setValue(aImage.width);
		this._sourceHeight.setValue(aImage.height);
		this._destinationWidth.setValue(aImage.width);
		this._destinationHeight.setValue(aImage.height);
		
		return this;
	};
	
	objectFunctions.getStartPoint = function(aReturnPoint) {
		return null;
	};
	
	objectFunctions.getLastCurve = function() {
		return null;
	};
	
	objectFunctions.hasCurves = function() {
		return false;
	};
	
	objectFunctions.canDraw = function() {
		return false;
	};
	
	objectFunctions._fillText = function(aContext, aStyle, aText, aX, aY, aMaxWidth) {
		if(aStyle != null) {
			aContext.fillStyle = aStyle;
			if(aMaxWidth != null) {
				aContext.fillText(aText, aX, aY, aMaxWidth);
			}
			else {
				aContext.fillText(aText, aX, aY);
			}
		}
	};
	
	objectFunctions._strokeText = function(aContext, aStyle, aText, aX, aY, aMaxWidth) {
		if(aStyle != null) {
			aContext.strokeStyle = aStyle;
			if(aMaxWidth != null) {
				aContext.strokeText(aText, aX, aY, aMaxWidth);
			}
			else {
				aContext.strokeText(aText, aX, aY);
			}
		}
	};
	
	objectFunctions.draw = function(aContext) {
		
		aContext.save();
		
		aContext.font = this._font.getValue();
		aContext.textAlign = this._align.getValue();
		aContext.textBaseline = this._baseline.getValue();
		
		aContext.lineWidth = this._lineWidth.getValue();
		aContext.lineCap = this._lineCap.getValue();
		aContext.lineJoin = this._lineJoin.getValue();
		aContext.miterLimit = this._miterLimit.getValue();
		
		var text = this._text.getValue();
		var x = this._x.getValue();
		var y = this._x.getValue();
		var maxWidth = this._maxWidth.getValue();
		var strokeStyle = this._strokeStyle.getValue();
		var fillStyle = this._fillStyle.getValue();
		
		if(this._strokeOverFill) {
			this._fillText(aContext, fillStyle, text, x, y, maxWidth);
			this._strokeText(aContext, strokeStyle, text, x, y, maxWidth);
		}
		else {
			this._strokeText(aContext, strokeStyle, text, x, y, maxWidth);
			this._fillText(aContext, fillStyle, text, x, y, maxWidth);
		}
		
		aContext.restore();
	};
	
	staticFunctions.create = function(aText) {
		var newCanvasTextGraphics2d = (new ClassReference()).init();
		
		newCanvasTextGraphics2d.setPropertyInput("text", aText);
		
		return newCanvasTextGraphics2d;
	};
});