/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for a pixel effect.
 */
dbm.registerClass("com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject");
	
	//Self reference
	var PixelEffectBaseObject = dbm.importClass("com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject");
	
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
		//console.log("com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject::_init");
		
		this.superCall();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		return this;
	};
	
	objectFunctions._getDataPosition = function(aX, aY, aWidth, aHeight) {
		return 4*((aWidth*aY)+aX);
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject::applyEffect");
		
		//MENOTE: should be overridden
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._graphicsUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newPixelEffectBaseObject = (new ClassReference()).init();
		return newPixelEffectBaseObject;
	};
});