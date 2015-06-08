/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var SplineSelectionPlayer = dbm.importClass("dbm.projects.experiments.splineselection.SplineSelectionPlayer");
	var Card = dbm.importClass("dbm.projects.experiments.splineselection.gui.Card");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("dbm.flow.nodes.math.round.RoundNode");
	var Transform3dSetupNode = dbm.importClass("dbm.flow.nodes.display.Transform3dSetupNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var DomManipulationFunctions = dbm.importClass("dbm.utils.htmldom.DomManipulationFunctions");
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	var PrintTextHandler = dbm.importClass("dbm.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._addTemplate("player", "assets/templates.html#splineSelectionPlayer");
		this._addTemplate("card", "assets/templates.html#card");
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut("SplineSelectionPlayer", SplineSelectionPlayer);
		dbm.singletons.dbmTemplateManager.registerClassShortcut("Card", Card);
		
		this._dataPath = "assets/twitter/streams/developedbyme.json";
		
		this._assetsLoader.addAssetsByPath(this._dataPath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
	
		//Group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
	
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
	
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
	
		//Mouse position
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
	
		//Mouse parameteric node
		var parameterangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), 0, 3);
		
		var templateResult = this._createControllerFromTemplate("player");
		var newSplineSelectionPlayer = templateResult.mainController;
		
		newSplineSelectionPlayer.setPropertyInput("x", scaleXNode.getProperty("outputValue"));
		newSplineSelectionPlayer.setPropertyInput("y", scaleYNode.getProperty("outputValue"));
		//newSplineSelectionPlayer.setPropertyInput("position", parameterangeNode.getProperty("outputValue"));
		newSplineSelectionPlayer.start();
		
		var transformationSetup = Transform3dSetupNode.create(newSplineSelectionPlayer.getElement(), 1500);
		transformationSetup.getProperty("display").startUpdating();
		
		var mainCardTemplateElement = dbm.singletons.dbmAssetRepository.getAsset(this._templatePaths.getObject("card")).getData();
		
		var currentArray = dbm.singletons.dbmAssetRepository.getAssetData(this._dataPath);
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			
			var cardTemplateElement = DomManipulationFunctions.importNode(mainCardTemplateElement, true, dbm.getDocument());
		
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(cardTemplateElement);
			
			var currentData = currentArray[i];
			console.log(currentData);
			var imageUrl = currentData["user"]["profile_image_url"];
			var text = currentData["text"];
			
			templateResult.mainController.getElement().id = null;
			var image = templateResult.getController("image");
			image.getProperty("source").setValue(imageUrl);
			templateResult.mainController.getElement().querySelector(".text").innerHTML = text;
		
			newSplineSelectionPlayer.addCard(templateResult.mainController, 3*i/currentArrayLength);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});