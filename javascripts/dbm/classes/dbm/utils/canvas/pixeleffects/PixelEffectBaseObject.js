/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for a pixel effect.
 */
dbm.registerClass("dbm.utils.canvas.pixeleffects.PixelEffectBaseObject", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.pixeleffects.PixelEffectBaseObject");
	
	//Self reference
	var PixelEffectBaseObject = dbm.importClass("dbm.utils.canvas.pixeleffects.PixelEffectBaseObject");
	
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
		//console.log("dbm.utils.canvas.pixeleffects.PixelEffectBaseObject::_init");
		
		this.superCall();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		return this;
	};
	
	objectFunctions._getDataPosition = function(aX, aY, aWidth, aHeight) {
		return 4*((aWidth*aY)+aX);
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("dbm.utils.canvas.pixeleffects.PixelEffectBaseObject::applyEffect");
		
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