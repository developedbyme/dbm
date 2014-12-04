/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Canvas layer that renders it's children in a separate canvas and applies a pixel effect before drawing it to the current canvas.
 */
dbm.registerClass("dbm.utils.canvas.PixelEffectLayer2d", "dbm.utils.canvas.CanvasRenderLayer2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.PixelEffectLayer2d");
	
	//Self reference
	var PixelEffectLayer2d = dbm.importClass("dbm.utils.canvas.PixelEffectLayer2d");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.PixelEffectLayer2d::_init");
		
		this.superCall();
		
		this._effectsCanvas = this.createProperty("effectsCanvas", dbm.singletons.dbmHtmlDomManager.createTempCanvas());
		this._pixelEffect = null;
		
		return this;
	};
	
	/**
	 * Set the effect to use
	 *
	 * @param	aEffect		PixelEffectBaseObject	The effect to use.
	 *
	 * @return	self
	 */
	objectFunctions.setEffect = function(aEffect) {
		this._pixelEffect = this.addDestroyableObject(aEffect);
		
		return this;
	};
	
	/**
	 * Draws the graphics and children of this layer.
	 *
	 * @param	aContext				The canvas context to draw on.
	 * @param	aNumberOfLinksToResolve	The number of links to use before recursion stops.
	 */
	objectFunctions._drawGraphicsAndChildren = function(aContext, aNumberOfLinksToResolve) {
		//console.log("dbm.utils.canvas.PixelEffectLayer2d::_drawGraphicsAndChildren");
		
		var renderCanvas = this._renderCanvas.getValueWithoutFlow();
		var effectsCanvas = this._effectsCanvas.getValueWithoutFlow();
		
		var renderWidth = this._renderWidth.getValueWithoutFlow();
		var renderHeight = this._renderHeight.getValueWithoutFlow();
		var renderOffsetX = this._renderOffsetX.getValueWithoutFlow();
		var renderOffsetY = this._renderOffsetY.getValueWithoutFlow();
		
		this._sizeRenderCanvas(effectsCanvas, renderWidth, renderHeight);
		this._renderInCanvas(renderCanvas, renderWidth, renderHeight, renderOffsetX, renderOffsetY, aNumberOfLinksToResolve);
		
		if(this._pixelEffect !== null) {
			this._pixelEffect.applyEffect(renderCanvas.getContext("2d"), effectsCanvas.getContext("2d"), renderWidth, renderHeight, renderOffsetX, renderOffsetY);
			aContext.drawImage(effectsCanvas, 0, 0, renderWidth, renderHeight, renderOffsetX, renderOffsetY, renderWidth, renderHeight);
		}
		else {
			aContext.drawImage(renderCanvas, 0, 0, renderWidth, renderHeight, renderOffsetX, renderOffsetY, renderWidth, renderHeight);
		}
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aEffect			PixelEffectBaseObject	The effect to use. (optional)
	 * @param	aOffsetX		Number					The number of pixels to x offset the rendered result. (optional)
	 * @param	aOffsetY		Number					The number of pixels to y offset the rendered result. (optional)
	 * @param	aWidth			Number					The width (in pixels) to render. (optional)
	 * @param	aHeight			Number					The height (in pixels) to render. (optional)
	 * @param	aCanvas			Canvas					The canvas to render on. (optional)
	 * @param	aEffectCanvas	Canvas					The canvas to render the effects on. (optional)
	 *
	 * @return	PixelEffectLayer2d	The newly created instance.
	 */
	staticFunctions.create = function(aEffect, aOffsetX, aOffsetY, aWidth, aHeight, aCanvas, aEffectCanvas) {
		var newPixelEffectLayer2d = (new ClassReference()).init();
		
		if(VariableAliases.isSet(aEffect)) {
			newPixelEffectLayer2d.setEffect(aEffect);
		}
		
		newPixelEffectLayer2d.setPropertyInputWithoutNull("renderOffsetX", aOffsetX);
		newPixelEffectLayer2d.setPropertyInputWithoutNull("renderOffsetY", aOffsetY);
		newPixelEffectLayer2d.setPropertyInputWithoutNull("renderWidth", aWidth);
		newPixelEffectLayer2d.setPropertyInputWithoutNull("renderHeight", aHeight);
		newPixelEffectLayer2d.setPropertyInputWithoutNull("renderCanvas", aCanvas);
		newPixelEffectLayer2d.setPropertyInputWithoutNull("effectsCanvas", aEffectCanvas);
		
		return newPixelEffectLayer2d;
	};
});