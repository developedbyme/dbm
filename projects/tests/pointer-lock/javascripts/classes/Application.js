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
	var PointerLockNode = dbm.importClass("dbm.flow.nodes.userinput.PointerLockNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetPropertyValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyValueObject");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._mainTemplate = "assets/templates.html#main";
		
		this._assetsLoader.addAssetsByPath(this._mainTemplate);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplate, {}, true, this._contentHolder, true);
		var mainController = templateResult.mainController;
		
		var lockButton = templateResult.getController("button");
		var cursor = templateResult.getController("cursor");
		
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		var pointerLockNode = this.addDestroyableObject(PointerLockNode.create());
		
		cursor.setElementAsTransformed();
		cursor.setPropertyInput("inDom", pointerLockNode.getProperty("locked"));
		var xRepeatedRange = RepeatedRangeNode.create(pointerLockNode.getProperty("x"), 0, windowSizeNode.getProperty("width"));
		cursor.setPropertyInput("x", xRepeatedRange.getProperty("outputValue"));
		var yRepeatedRange = RepeatedRangeNode.create(pointerLockNode.getProperty("y"), 0, windowSizeNode.getProperty("height"));
		cursor.setPropertyInput("y", yRepeatedRange.getProperty("outputValue"));
		cursor.getProperty("display").startUpdating();
		
		lockButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(pointerLockNode, pointerLockNode.start, []));
		lockButton.activate();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});