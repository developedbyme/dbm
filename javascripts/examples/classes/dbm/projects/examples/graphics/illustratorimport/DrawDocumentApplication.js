/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Examples that draws gradinets to a canvas
 */
dbm.registerClass("dbm.projects.examples.graphics.illustratorimport.DrawDocumentApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DrawDocumentApplication = dbm.importClass("dbm.projects.examples.graphics.illustratorimport.DrawDocumentApplication");
	
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
	var IllustratorFileGenerator = dbm.importClass("dbm.utils.canvas.generators.IllustratorFileGenerator");
	var DomFlowFunctions = dbm.importClass("dbm.utils.htmldom.DomFlowFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_init");
		
		this.superCall();
		
		this._dataAssetPath = "../assets/examples/graphics/illustratorimport/shapeData.xml";
		this._treeStructureTemplatePath = "../assets/examples/workspace/treeStructure/canvasView.html#treeStructure";
		this._treeStructureItemTemplatePath = "../assets/examples/workspace/treeStructure/canvasView.html#treeStructureItem";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._dataAssetPath, this._treeStructureTemplatePath, this._treeStructureItemTemplatePath);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_createPage");
		
		var treeStructureTemplateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._treeStructureTemplatePath, null, true, dbm.getDocument(), true);
		var treeStructureView = treeStructureTemplateResult.mainController;
		
		treeStructureView.setItemTemplate(dbm.singletons.dbmAssetRepository.getAssetData(this._treeStructureItemTemplatePath));
		treeStructureView.getProperty("display").startUpdating();
		treeStructureView.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._setupTreeStructureItem, [GetVariableObject.createSelectDataCommand()]));
		
		
		var shapeData = dbm.singletons.dbmAssetRepository.getAssetData(this._dataAssetPath);
		
		var dataName = "shapeData";
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(shapeData), dataName);
		var parsedShapeData = dbm.singletons.dbmDataManager.getData(dataName);
		
		//console.log(parsedShapeData);
		
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
		displayLayer.getProperty("scaleY").setValue(1);
		
		
		var layersTreeStructure = parsedShapeData.data.data;
		IllustratorFileGenerator.drawLayers(layersTreeStructure.getRoot().getChildren(), displayLayer, canvasController);
		
		
		canvasController.getProperty("display").update();
		
		treeStructureView.setTreeStructure(canvasController._hierarchy);
	};
	
	objectFunctions._setupTreeStructureItem = function(aItem) {
		//console.log("dbm.projects.examples.graphics.illustratorimport.DrawDocumentApplication::_setupTreeStructureItem");
		//console.log(aItem);
		
		aItem.getProperty("ownHeight").setValue(110);
		
		var layer = aItem.getTreeStructureItem().data;
		var element = aItem.getElement();
		
		DomFlowFunctions.setElementText(element.querySelector("*[name=x] *[name=value]"), layer.getProperty("x"));
		DomFlowFunctions.setElementText(element.querySelector("*[name=y] *[name=value]"), layer.getProperty("y"));
		DomFlowFunctions.setElementText(element.querySelector("*[name=rotation] *[name=value]"), layer.getProperty("rotate"));
		DomFlowFunctions.setElementText(element.querySelector("*[name=scaleX] *[name=value]"), layer.getProperty("scaleX"));
		DomFlowFunctions.setElementText(element.querySelector("*[name=scaleY] *[name=value]"), layer.getProperty("scaleY"));
		DomFlowFunctions.setElementText(element.querySelector("*[name=hasMask] *[name=value]"), layer.getProperty("useMask"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});