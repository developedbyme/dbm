/**
 * A graphics in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	
	var CanvasImageGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d::init");
		
		this.superCall();
		
		this._image = this.createProperty("image", null);
		this._sourceX = this.createProperty("sourceX", 0);
		this._sourceY = this.createProperty("sourceY", 0);
		this._destinationX = this.createProperty("destinationX", 0);
		this._destinationY = this.createProperty("destinationY", 0);
		
		this._sourceWidth = this.createProperty("sourceWidth", 0);
		this._sourceHeight = this.createProperty("sourceHeight", 0);
		this._destinationWidth = this.createProperty("destinationWidth", 0);
		this._destinationHeight = this.createProperty("destinationHeight", 0);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
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
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d::draw");
		//console.log(this, this._curves, this.strokeStyle);
		
		aContext.drawImage(this._image.getValue(), this._sourceX.getValue(), this._sourceY.getValue(), this._sourceWidth.getValue(), this._sourceHeight.getValue(), this._destinationX.getValue(), this._destinationY.getValue(), this._destinationWidth.getValue(), this._destinationHeight.getValue());
		
	};
	
	staticFunctions.create = function(aImage) {
		var newCanvasImageGraphics2d = (new ClassReference()).init();
		
		newCanvasImageGraphics2d.setImage(aImage);
		
		return newCanvasImageGraphics2d;
	};
});