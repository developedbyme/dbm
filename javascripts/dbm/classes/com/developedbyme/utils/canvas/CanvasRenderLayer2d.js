dbm.registerClass("com.developedbyme.utils.canvas.CanvasRenderLayer2d", "com.developedbyme.utils.canvas.CanvasLayer2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasRenderLayer2d");
	
	var CanvasRenderLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasRenderLayer2d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasRenderLayer2d::_init");
		
		this.superCall();
		
		this._renderCanvas = this.createProperty("renderCanvas", dbm.singletons.dbmHtmlDomManager.getTempCanvas());
		this._renderWidth = this.createProperty("renderWidth", 320);
		this._renderHeight = this.createProperty("renderHeight", 240);
		this._renderOffsetX = this.createProperty("renderOffsetX", 0);
		this._renderOffsetY = this.createProperty("renderOffsetY", 0);
		
		//METODO: Add render scale
		
		return this;
	};
	
	objectFunctions._drawGraphicsAndChildren = function(aContext, aNumberOfLinksToResolve) {
		
		var renderCanvas = this._renderCanvas.getValue();
		var renderWidth = this._renderWidth.getValue();
		var renderHeight = this._renderHeight.getValue();
		var renderOffsetX = this._renderOffsetX.getValue();
		var renderOffsetY = this._renderOffsetY.getValue();
		
		var renderContext = renderCanvas.getContext("2d");
		
		renderContext.setTransform(1, 0, 0, 1, 0, 0);
		renderCanvas.width = renderWidth;
		renderCanvas.height = renderHeight;
		renderContext.clearRect(0, 0, renderWidth, renderHeight);
		
		renderContext.setTransform(1, 0, 0, 1, -1*renderOffsetX, -1*renderOffsetY);
		
		this._drawGraphics(renderContext);
		this._drawChildren(renderContext, this._treeStructureItem.getChildren(), aNumberOfLinksToResolve);
		
		aContext.drawImage(renderCanvas, 0, 0, renderWidth, renderHeight, renderOffsetX, renderOffsetY, renderWidth, renderHeight);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._renderCanvas = null;
		this._renderWidth = null;
		this._renderHeight = null;
		this._renderOffsetX = null;
		this._renderOffsetY = null;
		
		this.superCall();
	};
	
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