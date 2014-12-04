/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Examples that draws an image and applies a pixel effect.
 */
dbm.registerClass("dbm.projects.examples.graphics.canvas.PixelEffectApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var PixelEffectApplication = dbm.importClass("dbm.projects.examples.graphics.canvas.PixelEffectApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var PixelEffectLayer2d = dbm.importClass("dbm.utils.canvas.PixelEffectLayer2d");
	var GrayscaleEffect = dbm.importClass("dbm.utils.canvas.pixeleffects.color.GrayscaleEffect");
	var PolarCoordinatesEffect = dbm.importClass("dbm.utils.canvas.pixeleffects.distort.PolarCoordinatesEffect");
	var MeshDeformationEffect = dbm.importClass("dbm.utils.canvas.pixeleffects.distort.MeshDeformationEffect");
	var PointMesh = dbm.importClass("dbm.core.data.geometry.mesh.PointMesh");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.graphics.canvas.PixelEffectApplication::_init");
		
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
		console.log("dbm.projects.examples.graphics.canvas.PixelEffectApplication::_createPage");
		
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		var canvasController = canvasView.getController();
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(1024);
		canvasView.getProperty("height").setValue(768);
		
		var displayLayer = canvasController.getLayer("/main");
		displayLayer.getProperty("scaleX").setValue(1);
		displayLayer.getProperty("scaleY").setValue(1);
		
		var image = dbm.singletons.dbmAssetRepository.getAssetData(this._imagePath);
		
		//var pixelEffect = GrayscaleEffect.create();
		
		//var pixelEffect = PolarCoordinatesEffect.create(200, 200, 200, 0, 0, 0, image.naturalWidth, image.naturalHeight);
		
		var meshGridLength = 4;
		var pointMesh = PointMesh.create2d(meshGridLength, meshGridLength, 0, 0, 200, 200);
		var pixelEffect = MeshDeformationEffect.create(pointMesh, 0, 0, image.naturalWidth, image.naturalHeight);
		var cornerPoint = pointMesh.getValue(meshGridLength-1, meshGridLength-1);
		cornerPoint.x = 300;
		cornerPoint.y = 300;
		
		var pixelEffectLayer = PixelEffectLayer2d.create(pixelEffect, 0, 0, 1024, 768);
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