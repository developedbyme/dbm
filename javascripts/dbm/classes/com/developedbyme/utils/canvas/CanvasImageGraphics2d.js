/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A graphics in a 2d canvas.
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	
	var CanvasImageGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d::_init");
		
		this.superCall();
		
		this._image = this.createProperty("image", null);
		this._image.setAlwaysUpdateFlow(true);
		this._sourceX = this.createProperty("sourceX", 0);
		this._sourceY = this.createProperty("sourceY", 0);
		this._destinationX = this.createProperty("destinationX", 0);
		this._destinationY = this.createProperty("destinationY", 0);
		
		this._sourceWidth = this.createProperty("sourceWidth", 0);
		this._sourceHeight = this.createProperty("sourceHeight", 0);
		this._destinationWidth = this.createProperty("destinationWidth", 0);
		this._destinationHeight = this.createProperty("destinationHeight", 0);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		this._graphicsUpdate.connectInput(this._image);
		this._graphicsUpdate.connectInput(this._sourceX);
		this._graphicsUpdate.connectInput(this._sourceY);
		this._graphicsUpdate.connectInput(this._destinationX);
		this._graphicsUpdate.connectInput(this._destinationY);
		this._graphicsUpdate.connectInput(this._sourceWidth);
		this._graphicsUpdate.connectInput(this._sourceHeight);
		this._graphicsUpdate.connectInput(this._destinationWidth);
		this._graphicsUpdate.connectInput(this._destinationHeight);
		
		return this;
	};
	
	objectFunctions.setImage = function(aImage) {
		
		this._image.setValue(aImage);
		
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
		//console.log(this._image.getValue(), this._sourceX.getValue(), this._sourceY.getValue(), this._sourceWidth.getValue(), this._sourceHeight.getValue(), this._destinationX.getValue(), this._destinationY.getValue(), this._destinationWidth.getValue(), this._destinationHeight.getValue());
		
		var image = this._image.getValueWithoutFlow();
		
		if(image !== null) {
			var sourceX = Math.max(0, this._sourceX.getValueWithoutFlow());
			var sourceY = Math.max(0, this._sourceY.getValueWithoutFlow());
			var sourceWidth = Math.min(image.width, this._sourceWidth.getValueWithoutFlow());
			var sourceHeight = Math.min(image.height, this._sourceHeight.getValueWithoutFlow());
			
			if(sourceWidth !== 0 && sourceHeight !== 0) {
				aContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, this._destinationX.getValueWithoutFlow(), this._destinationY.getValueWithoutFlow(), this._destinationWidth.getValueWithoutFlow(), this._destinationHeight.getValueWithoutFlow());
			}
		}
	};
	
	staticFunctions.create = function(aImage) {
		var newCanvasImageGraphics2d = (new ClassReference()).init();
		
		newCanvasImageGraphics2d.setImage(aImage);
		
		return newCanvasImageGraphics2d;
	};
	
	staticFunctions.createConnectedImage = function(aImageProperty, aWidth, aHeight) {
		//console.log("com.developedbyme.utils.canvas.CanvasImageGraphics2d::createConnectedImage");
		//console.log(aImageProperty, aWidth, aHeight);
		
		var newCanvasImageGraphics2d = (new ClassReference()).init();
		
		newCanvasImageGraphics2d.setPropertyInputWithoutNull("image", aImageProperty);
		newCanvasImageGraphics2d.setPropertyInputWithoutNull("sourceWidth", aWidth);
		newCanvasImageGraphics2d.setPropertyInputWithoutNull("sourceHeight", aHeight);
		newCanvasImageGraphics2d.setPropertyInputWithoutNull("destinationWidth", aWidth);
		newCanvasImageGraphics2d.setPropertyInputWithoutNull("destinationHeight", aHeight);
		
		return newCanvasImageGraphics2d;
	};
});