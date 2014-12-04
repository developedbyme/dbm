/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.graphics.flashimport.DrawShapeApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DrawShapeApplication = dbm.importClass("dbm.projects.examples.graphics.flashimport.DrawShapeApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.graphics.flashimport.DrawShapeApplication::_init");
		
		this.superCall();
		
		this._dataAssetPath = "../assets/examples/graphics/flashimport/shapeData.xml";
		
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
		console.log("dbm.projects.examples.graphics.flashimport.DrawShapeApplication::_createPage");
		
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		var canvasController = canvasView.getController();
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(2*1024);
		canvasView.getProperty("height").setValue(2*768);
		
		var displayLayer = canvasController.getLayer("/main");
		displayLayer.getProperty("scaleX").setValue(1);
		displayLayer.getProperty("scaleY").setValue(1);
		
		var shapeData = dbm.singletons.dbmAssetRepository.getAssetData(this._dataAssetPath);
		
		var dataName = "shapeData";
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(shapeData), dataName);
		var parsedShapeData = dbm.singletons.dbmDataManager.getData(dataName);
		
		console.log(parsedShapeData);
		
		this._drawLayers(parsedShapeData.data.data, canvasController, "/main");
		
		/*
		var currentArray = parsedShapeData.data.data;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			var currentLayerName = "/main/" + currentLayer.metaData.getObject("name");
			
			this._drawObjects(currentLayer.data, canvasController, currentLayerName);
		}
		*/
		
		canvasController.getProperty("display").update();
	};
	
	objectFunctions._drawLayers = function(aLayers, aCanvasController, aLayerPrefix) {
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			var currentLayerName = aLayerPrefix + "/" + currentLayer.metaData.getObject("name");
			
			this._drawObjects(currentLayer.data, aCanvasController, currentLayerName);
		}
	};
	
	objectFunctions._drawObjects = function(aObjects, aCanvasController, aLayerPrefix) {
		var currentArray = aObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			var currentElementType = currentElement.metaData.getObject("type");
			if(currentElementType === "shape") {
				var currentArray2 = currentElement.data;
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					this._drawPart(currentArray2[j], aCanvasController.getLayer(aLayerPrefix + "/" + "element_" + i + "/" + "part_" + j), aCanvasController);
				}
			}
			else if(currentElementType === "group") {
				this._drawObjects(currentElement.data, aCanvasController, aLayerPrefix + "/" + "element_" + i);
			}
			else if(currentElementType === "instance") {
				
				var currentLayerName = aLayerPrefix + "/" + "element_" + i;
				
				var currentLayer = aCanvasController.getLayer(currentLayerName);
				var animations = currentElement.data.animations;
				
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("x"), 0, currentLayer.getProperty("x"));
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("y"), 0, currentLayer.getProperty("y"));
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("scaleX"), 0, currentLayer.getProperty("scaleX"));
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("scaleY"), 0, currentLayer.getProperty("scaleY"));
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("rotation"), 0, currentLayer.getProperty("rotate"));
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(animations.getObject("alpha"), 0, currentLayer.getProperty("alpha"));
				
				this._drawLayers(currentElement.data.timeline.data, aCanvasController, currentLayerName);
			}
		}
	};
	
	objectFunctions._drawPart = function(aPart, aLayer, aCanvasController) {
		console.log("dbm.projects.examples.graphics.flashimport.DrawShapeApplication::_drawPart");
		console.log(aPart, aLayer);
		
		var currentData = aPart.data;
		
		//aLayer.setStrokeStyle(0, "#000000");
		var currentFillStyle = currentData.fillStyle;
		if(currentFillStyle !== null) {
			switch(currentFillStyle.style) {
				case "solid":
					aLayer.setFillStyle(currentData.fillStyle.color);
					break;
				case "linearGradient":
					//METODO
					var startPoint = currentFillStyle.startPoint;
					var endPoint = currentFillStyle.endPoint;
					var canvasGradient = aCanvasController.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y, currentFillStyle.gradient);
					aLayer.setFillStyle(canvasGradient);
					break;
				default:
					//METODO: error message
					break;
			}
			
		}
		aLayer.drawCurve(currentData.curve);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});