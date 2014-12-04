/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Pixel effect that turns a graphics into grayscale.
 */
dbm.registerClass("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect", "dbm.utils.canvas.pixeleffects.PixelEffectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect");
	
	//Self reference
	var GrayscaleEffect = dbm.importClass("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect");
	
	//Error report
	
	//Dependnecies
	
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect::_init");
		
		this.superCall();
		
		this._redScale = this.createProperty("redScale", 0.2126);
		this._greenScale = this.createProperty("greenScale", 0.7152);
		this._blueScale = this.createProperty("blueScale", 0.0722);
		
		this._graphicsUpdate.connectInput(this._redScale);
		this._graphicsUpdate.connectInput(this._greenScale);
		this._graphicsUpdate.connectInput(this._blueScale);
		
		return this;
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect::applyEffect");
		
		var inputImageData = aInputGraphics.getImageData(0, 0, aWidth, aHeight);
		var outputImageData = aOutputGraphics.getImageData(0, 0, aWidth, aHeight);
		
		var inputData = inputImageData.data;
		var outputData = outputImageData.data;
		
		var redScale = this._redScale.getValueWithoutFlow();
		var greenScale = this._greenScale.getValueWithoutFlow();
		var blueScale = this._blueScale.getValueWithoutFlow();
		
		var currentArrayLength = inputData.length;
		for(var i = 0; i < currentArrayLength; i += 4) {
			var value = redScale*inputData[i] + greenScale*inputData[i+1] + blueScale*inputData[i+2];
			outputData[i] = value;
			outputData[i+1] = value;
			outputData[i+2] = value;
			outputData[i+3] = inputData[i+3];
		}
		
		aOutputGraphics.putImageData(outputImageData, 0, 0);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newGrayscaleEffect = (new ClassReference()).init();
		return newGrayscaleEffect;
	};
});