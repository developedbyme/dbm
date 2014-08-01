/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.graphics.flashimport.DrawShapeApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawShapeApplication = dbm.importClass("com.developedbyme.projects.examples.graphics.flashimport.DrawShapeApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
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
		//console.log("com.developedbyme.projects.examples.graphics.flashimport.DrawShapeApplication::_init");
		
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
		console.log("com.developedbyme.projects.examples.graphics.flashimport.DrawShapeApplication::_createPage");
		
		
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
		
		var currentArray = parsedShapeData.data;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			var currentLayerName = currentLayer.metaData.getObject("name");
			var currentArray2 = currentLayer.data;
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentElement = currentArray2[j];
				var currentArray3 = currentElement.data;
				var currentArray3Length = currentArray3.length;
				for(var k = 0; k < currentArray3Length; k++) {
					this._drawPart(currentArray3[k], canvasController.getLayer("/main/" + currentLayerName + "/" + "element_" + j + "/" + "part_" + k));
				}
			}
		}
		
		canvasController.getProperty("display").update();
	};
	
	objectFunctions._drawPart = function(aPart, aLayer) {
		console.log("com.developedbyme.projects.examples.graphics.flashimport.DrawShapeApplication::_drawPart");
		console.log(aPart, aLayer);
		
		var currentData = aPart.data;
		
		aLayer.setStrokeStyle(0, "#000000");
		if(currentData.fillStyle !== null) {
			aLayer.setFillStyle(currentData.fillStyle.color);
		}
		aLayer.drawCurve(currentData.curve);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});