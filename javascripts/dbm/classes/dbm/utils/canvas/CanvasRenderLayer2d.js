/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Canvas layer that renders it's children in a separate canvas before drawing it to the current canvas.
 */
dbm.registerClass("dbm.utils.canvas.CanvasRenderLayer2d", "dbm.utils.canvas.CanvasLayer2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.CanvasRenderLayer2d");
	
	//Self reference
	var CanvasRenderLayer2d = dbm.importClass("dbm.utils.canvas.CanvasRenderLayer2d");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.CanvasRenderLayer2d::_init");
		
		this.superCall();
		
		this._renderCanvas = this.createProperty("renderCanvas", dbm.singletons.dbmHtmlDomManager.createTempCanvas());
		this._renderWidth = this.createProperty("renderWidth", 320);
		this._renderHeight = this.createProperty("renderHeight", 240);
		this._renderOffsetX = this.createProperty("renderOffsetX", 0);
		this._renderOffsetY = this.createProperty("renderOffsetY", 0);
		
		//METODO: Add render scale
		
		return this;
	};
	
	objectFunctions._sizeRenderCanvas = function(aCanvas, aWidth, aHeight) {
		//console.log("dbm.utils.canvas.CanvasRenderLayer2d::_sizeRenderCanvas");
		//console.log(aCanvas, aWidth, aHeight);
		
		var theContext = aCanvas.getContext("2d");
		
		theContext.setTransform(1, 0, 0, 1, 0, 0);
		aCanvas.width = aWidth;
		aCanvas.height = aHeight;
		theContext.clearRect(0, 0, aWidth, aHeight);
	};
	
	/**
	 * Renders this layer into a canvas
	 *
	 * @param	aCanvas						Canvas	The context to draw in.
	 * @param	aWidth						Number	The width (in pixels) to render.
	 * @param	aHeight						Number	The height (in pixels) to render.
	 * @param	aOffsetX					Number	The number of pixels to x offset the rendered result.
	 * @param	aOffsetY					Number	The number of pixels to y offset the rendered result.
	 * @param	aNumberOfLinksToResolve		Number	The number of links to use before recursion stops.
	 */
	objectFunctions._renderInCanvas = function(aCanvas, aWidth, aHeight, aOffsetX, aOffsetY, aNumberOfLinksToResolve) {
		//console.log("dbm.utils.canvas.CanvasRenderLayer2d::_renderInCanvas");
		//console.log(aCanvas, aWidth, aHeight, aOffsetX, aOffsetY, aNumberOfLinksToResolve);
		
		this._sizeRenderCanvas(aCanvas, aWidth, aHeight);
		
		var theContext = aCanvas.getContext("2d");
		theContext.setTransform(1, 0, 0, 1, -1*aOffsetX, -1*aOffsetY);
		
		this._drawGraphics(theContext);
		this._drawChildren(theContext, this._treeStructureItem.getChildren(), aNumberOfLinksToResolve);
		
	};
	
	/**
	 * Draws the graphics and children of this layer.
	 *
	 * @param	aContext				The canvas context to draw on.
	 * @param	aNumberOfLinksToResolve	The number of links to use before recursion stops.
	 */
	objectFunctions._drawGraphicsAndChildren = function(aContext, aNumberOfLinksToResolve) {
		
		var renderCanvas = this._renderCanvas.getValueWithoutFlow();
		var renderWidth = this._renderWidth.getValueWithoutFlow();
		var renderHeight = this._renderHeight.getValueWithoutFlow();
		var renderOffsetX = this._renderOffsetX.getValueWithoutFlow();
		var renderOffsetY = this._renderOffsetY.getValueWithoutFlow();
		
		this._renderInCanvas(renderCanvas, renderWidth, renderHeight, renderOffsetX, renderOffsetY, aNumberOfLinksToResolve);
		
		aContext.drawImage(renderCanvas, 0, 0, renderWidth, renderHeight, renderOffsetX, renderOffsetY, renderWidth, renderHeight);
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._renderCanvas = null;
		this._renderWidth = null;
		this._renderHeight = null;
		this._renderOffsetX = null;
		this._renderOffsetY = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aOffsetX	Number	The number of pixels to x offset the rendered result. (optional)
	 * @param	aOffsetY	Number	The number of pixels to y offset the rendered result. (optional)
	 * @param	aWidth		Number	The width (in pixels) to render. (optional)
	 * @param	aHeight		Number	The height (in pixels) to render. (optional)
	 * @param	aCanvas				The canvas to render on. (optional)
	 *
	 * @return	CanvasRenderLayer2d	The newly created instance.
	 */
	staticFunctions.create = function(aOffsetX, aOffsetY, aWidth, aHeight, aCanvas) {
		var newCanvasRenderLayer2d = (new ClassReference()).init();
		
		newCanvasRenderLayer2d.setPropertyInputWithoutNull("renderOffsetX", aOffsetX);
		newCanvasRenderLayer2d.setPropertyInputWithoutNull("renderOffsetY", aOffsetY);
		newCanvasRenderLayer2d.setPropertyInputWithoutNull("renderWidth", aWidth);
		newCanvasRenderLayer2d.setPropertyInputWithoutNull("renderHeight", aHeight);
		newCanvasRenderLayer2d.setPropertyInputWithoutNull("renderCanvas", aCanvas);
		
		return newCanvasRenderLayer2d;
	};
});