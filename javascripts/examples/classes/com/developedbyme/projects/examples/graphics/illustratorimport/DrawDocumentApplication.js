/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Examples that draws gradinets to a canvas
 */
dbm.registerClass("com.developedbyme.projects.examples.graphics.illustratorimport.DrawDocumentApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawDocumentApplication = dbm.importClass("com.developedbyme.projects.examples.graphics.illustratorimport.DrawDocumentApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var CanvasRenderLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasRenderLayer2d");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_init");
		
		this.superCall();
		
		this._dataAssetPath = "../assets/examples/graphics/illustratorimport/shapeData.xml";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._dataAssetPath);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_createPage");
		
		var shapeData = dbm.singletons.dbmAssetRepository.getAssetData(this._dataAssetPath);
		
		var dataName = "shapeData";
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(shapeData), dataName);
		var parsedShapeData = dbm.singletons.dbmDataManager.getData(dataName);
		
		console.log(parsedShapeData);
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		var canvasController = canvasView.getController();
		canvasView.setElementAsSized();
		
		var canvasWidth = 1024;
		var canvasHeight = 768;
		
		var documentWidth = parsedShapeData.data.metaData.getObject("width");
		var documentHeight = parsedShapeData.data.metaData.getObject("height");
		
		canvasView.getProperty("width").setValue(canvasWidth);
		canvasView.getProperty("height").setValue(canvasHeight);
		
		var displayLayer = canvasController.getLayer("/main");
		displayLayer.getProperty("x").setValue(Math.round(-0.5*(documentWidth-canvasWidth)));
		displayLayer.getProperty("y").setValue(Math.round(-0.5*(documentHeight-canvasHeight)));
		displayLayer.getProperty("scaleX").setValue(1);
		displayLayer.getProperty("scaleY").setValue(-1);
		
		
		
		var layersTreeStructure = parsedShapeData.data.data;
		this._drawLayers(layersTreeStructure.getRoot().getChildren(), displayLayer, canvasController);
		
		
		
		canvasController.getProperty("display").update();
		console.log(canvasController);
	};
	
	objectFunctions._drawLayers = function(aLayers, aParentLayer, aCanvasController) {
		console.log("com.developedbyme.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_drawLayers");
		
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[currentArrayLength-i-1];
			var currentLayerMetaData = currentTreeStructureItem.data.metaData;
			var currentLayerData = currentTreeStructureItem.data.data;
			
			var layerType = currentLayerMetaData.getObject("type");
			
			
			var newLayer = null;
			
			if(layerType === "compoundPath") {
				
				var newTreeStrcutureItem = TreeStructureItem.create(currentTreeStructureItem.getName());
				
				//METODO: set size dynamically
				var renderWidth = 2000;
				var renderHeight = 2000;
				var renderOffsetX = 0;
				var renderOffsetY = 0;
				
				var renderLayer = CanvasRenderLayer2d.create(renderOffsetX, renderOffsetY, renderWidth, renderHeight);
				renderLayer.getProperty("scaleY").setValue(-1);
				newTreeStrcutureItem.data = renderLayer;
				renderLayer._linkRegistration_setTreeStructureItem(newTreeStrcutureItem);
				aParentLayer.getTreeStructureItem().addChild(newTreeStrcutureItem);
				aCanvasController.getProperty("graphicsUpdate").connectInput(renderLayer.getProperty("graphicsUpdate"));
				
				newLayer = renderLayer.getChildByPath("mirrorY");
				newLayer.getProperty("scaleY").setValue(-1);
			}
			else {
				newLayer = aParentLayer.getChildByPath(currentTreeStructureItem.getName());
			}
			
			if(layerType === "path") {
				var strokeData = currentLayerData.stroke;
				if(strokeData !== null) {
					//METODO: use all settings
					newLayer.setStrokeStyle(strokeData.lineWidth, strokeData.definition.getCssString());
				}
				var fillData = currentLayerData.fill;
				if(fillData !== null) {
					if(fillData.definition !== null) {
						//METODO: can this be fixed in the export so that definition can't be null?
						newLayer.setFillStyle(fillData.definition.getCssString());
					}
					
				}
				//METODO: stroke over fill setting
				
				var currentArray2 = currentLayerData.curves;
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					newLayer.drawCurve(currentArray2[j]);
				}
			}
			
			this._drawLayers(currentTreeStructureItem.getChildren(), newLayer, aCanvasController);
			
			if(layerType === "compoundPath") {
				//METODO: needs to be more sophisicated than a simple xor of everything
				var currentArray2 = newLayer.getTreeStructureItem().getChildren();
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentChildLayer = currentArray2[j].data;
					currentChildLayer.getProperty("compositeOperation").setValue("xor");
				}
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});