/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Examples that draws an image and applies a pixel effect.
 */
dbm.registerClass("com.developedbyme.projects.examples.graphics.canvas.PixelEffectApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var PixelEffectApplication = dbm.importClass("com.developedbyme.projects.examples.graphics.canvas.PixelEffectApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	var PixelEffectLayer2d = dbm.importClass("com.developedbyme.utils.canvas.PixelEffectLayer2d");
	var GrayscaleEffect = dbm.importClass("com.developedbyme.utils.canvas.pixeleffects.color.GrayscaleEffect");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.graphics.canvas.PixelEffectApplication::_init");
		
		this.superCall();
		
		this._imagePath = "../assets/temp/test/testImage.jpg";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._imagePath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.graphics.canvas.PixelEffectApplication::_createPage");
		
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		var canvasController = canvasView.getController();
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(1024);
		canvasView.getProperty("height").setValue(768);
		
		var displayLayer = canvasController.getLayer("/main");
		displayLayer.getProperty("scaleX").setValue(1);
		displayLayer.getProperty("scaleY").setValue(1);
		
		var image = dbm.singletons.dbmAssetRepository.getAssetData(this._imagePath);
		console.log(image);
		
		var pixelEffect = GrayscaleEffect.create();
		var pixelEffectLayer = PixelEffectLayer2d.create(pixelEffect, 0, 0, 1024, 768);
		console.log(pixelEffectLayer);
		pixelEffectLayer.createTreeStructureItem().setName("pixelEffect");
		displayLayer.getTreeStructureItem().addChild(pixelEffectLayer.getTreeStructureItem());
		canvasController.getProperty("graphicsUpdate").connectInput(pixelEffectLayer.getProperty("graphicsUpdate"));
		
		pixelEffectLayer.getChildByPath("image").drawImage(image);
		
		canvasController.getProperty("display").update();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});