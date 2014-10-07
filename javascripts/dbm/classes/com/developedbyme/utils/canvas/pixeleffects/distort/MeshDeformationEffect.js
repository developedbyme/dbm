/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Pixel effect that polars coordinates.
 */
dbm.registerClass("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect", "com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect");
	
	//Self reference
	var MeshDeformationEffect = dbm.importClass("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect");
	
	//Error report
	
	//Dependnecies
	
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::_init");
		
		this.superCall();
		
		this._mesh = this.createProperty("mesh", null);
		this._inputX = this.createProperty("inputX", 0);
		this._inputY = this.createProperty("inputY", 0);
		this._inputWidth = this.createProperty("inputWidth", 100);
		this._inputHeight = this.createProperty("inputHeight", 100);
		
		this._graphicsUpdate.connectInput(this._mesh);
		this._graphicsUpdate.connectInput(this._inputX);
		this._graphicsUpdate.connectInput(this._inputY);
		this._graphicsUpdate.connectInput(this._inputWidth);
		this._graphicsUpdate.connectInput(this._inputHeight);
		
		return this;
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::applyEffect");
		//console.log(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY);
		
		var inputImageData = aInputGraphics.getImageData(0, 0, aWidth, aHeight);
		var outputImageData = aOutputGraphics.getImageData(0, 0, aWidth, aHeight);
		
		var inputData = inputImageData.data;
		var outputData = outputImageData.data;
		
		//var x = this._x.getValueWithoutFlow();
		
		//METODO
		
		aOutputGraphics.putImageData(outputImageData, 0, 0);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
		
		this._mesh = null;
		this._inputX = null;
		this._inputY = null;
		this._inputWidth = null;
		this._inputHeight = null;
	};
	
	staticFunctions.create = function() {
		var newMeshDeformationEffect = (new ClassReference()).init();
		
		//newMeshDeformationEffect.setPropertyInputWithoutNull("x", aX);
		
		return newMeshDeformationEffect;
	};
});