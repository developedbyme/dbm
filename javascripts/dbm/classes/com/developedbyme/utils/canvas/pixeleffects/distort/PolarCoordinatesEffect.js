/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Pixel effect that polars coordinates.
 */
dbm.registerClass("com.developedbyme.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect", "com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect");
	
	//Self reference
	var PolarCoordinatesEffect = dbm.importClass("com.developedbyme.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect");
	
	//Error report
	
	//Dependnecies
	
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._radius = this.createProperty("radius", 50);
		this._startAngle = this.createProperty("startAngle", 0);
		
		this._inputMinX = this.createProperty("inputMinX", 0);
		this._inputMaxX = this.createProperty("inputMaxX", 320);
		this._inputMinY = this.createProperty("inputMinY", 0);
		this._inputMaxY = this.createProperty("inputMaxY", 240);
		
		this._graphicsUpdate.connectInput(this._x);
		this._graphicsUpdate.connectInput(this._y);
		this._graphicsUpdate.connectInput(this._radius);
		this._graphicsUpdate.connectInput(this._startAngle);
		
		this._graphicsUpdate.connectInput(this._inputMinX);
		this._graphicsUpdate.connectInput(this._inputMaxX);
		this._graphicsUpdate.connectInput(this._inputMinY);
		this._graphicsUpdate.connectInput(this._inputMaxY);
		
		return this;
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect::applyEffect");
		//console.log(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY);
		
		var inputImageData = aInputGraphics.getImageData(0, 0, aWidth, aHeight);
		var outputImageData = aOutputGraphics.getImageData(0, 0, aWidth, aHeight);
		
		var inputData = inputImageData.data;
		var outputData = outputImageData.data;
		
		var x = this._x.getValueWithoutFlow();
		var y = this._y.getValueWithoutFlow();
		var radius = this._radius.getValueWithoutFlow();
		var startAngle = this._startAngle.getValueWithoutFlow();
		
		var startX = Math.max(0, Math.floor(x-radius));
		var endX = Math.min(Math.ceil(x+radius), aWidth);
		var startY = Math.max(0, Math.floor(y-radius));
		var endY = Math.min(Math.ceil(y+radius), aHeight);
		
		var minX = this._inputMinX.getValueWithoutFlow();
		var maxX = this._inputMaxX.getValueWithoutFlow();
		var minY = this._inputMinY.getValueWithoutFlow();
		var maxY = this._inputMaxY.getValueWithoutFlow();
		
		for(var i = startX; i < endX; i++) {
			for(var j = startY; j < endY; j++) {
				
				var currentX = i-x;
				var currentY = j-y;
				
				var distanceParameter = VectorFunctions.lengthFromVectorValues2d(currentX, currentY)/radius;
				
				if(distanceParameter < 1) {
					var outputPoistion = this._getDataPosition(i, j, aWidth, aHeight);
					var angle = AngleFunctions.normalizeAngle(VectorFunctions.angleFromVectorValues(currentX, currentY)+startAngle);
					
					if(angle < 0) {
						angle += 2*Math.PI;
					}
					
					var inputX = (angle/(2*Math.PI))*(maxX-minX)+minX;
					var inputY = (1-distanceParameter)*(maxY-minY)+minY;
					
					var inputPosition = this._getDataPosition(Math.round(inputX), Math.round(inputY), aWidth, aHeight);
					
					outputData[outputPoistion] = inputData[inputPosition];
					outputData[outputPoistion+1] = inputData[inputPosition+1];
					outputData[outputPoistion+2] = inputData[inputPosition+2];
					outputData[outputPoistion+3] = inputData[inputPosition+3];
				}
			}
		}
		
		aOutputGraphics.putImageData(outputImageData, 0, 0);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aRadius, aStartAngle, aInputMinX, aInputMinY, aInputMaxX, aInputMaxY) {
		var newPolarCoordinatesEffect = (new ClassReference()).init();
		
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("x", aX);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("y", aY);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("radius", aRadius);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("startAngle", aStartAngle);
		
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("inputMinX", aInputMinX);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("inputMinY", aInputMinY);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("inputMaxX", aInputMaxX);
		newPolarCoordinatesEffect.setPropertyInputWithoutNull("inputMaxY", aInputMaxY);
		
		return newPolarCoordinatesEffect;
	};
});