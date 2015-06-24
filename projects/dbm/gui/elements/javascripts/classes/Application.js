/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var VideoView = dbm.importClass("dbm.gui.media.video.VideoView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var HtmlInputTypes = dbm.importClass("dbm.constants.htmldom.HtmlInputTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._addTemplate("main", "assets/templates.html#main");
		this._addTemplate("testTemplate", "assets/testTemplate.xml#testTemplate");
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		//var templateResult = this._createControllerFromTemplate("main");
		//var mainController = templateResult.mainController;
		
		this._setupButtonFromExistingElement(this._contentHolder.querySelector("#testButton"));
		this._createHtml();
		this._createDisplayIframe();
		this._createTemplateFromExistingElements(this._contentHolder.querySelector("#testTemplate"));
		this._createTemplateFromLoadedFile(dbm.singletons.dbmAssetRepository.getAsset(this._templatePaths.getObject("testTemplate")));
	};
	
	objectFunctions._setupButtonFromExistingElement = function(aElement) {
		var theButton = BaseButton.create(aElement);
		console.log(theButton);
		
		var callbackFunction = function() {
			console.log("callbackFunction");
			console.log(this);
		};
		
		var theCommand = CallFunctionCommand.createCommand(theButton, callbackFunction, []);
		theButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, theCommand);
		theButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(theButton, theButton.deactivate, []));
		
		theButton.activate();
	};
	
	objectFunctions._createHtml = function() {
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var newElement = htmlCreator.createNode("div", {id: "test", name: "testName"}, 
			"First text goes here ",
			htmlCreator.createNode("span", null, "(Second text)"),
			htmlCreator.createNode("div", {name: "imageNode", style: "width: 300px; height: 300px; background-color: #FF0000"}, 
				"Image",
				htmlCreator.createImage("dev/null.jpg"),
				htmlCreator.createLink("empty.html", "_blank", null,
					"Link in new window, ",
					"Click here!"
				)
			),
			htmlCreator.createNode("div", {name: "form"},
				htmlCreator.createForm("empty.html", "POST", null,
					htmlCreator.createInput("name", HtmlInputTypes.TEXT, "value in field", null),
					htmlCreator.createInput("submit", HtmlInputTypes.SUBMIT, "submit", null)
				)
			)
		);
		
		this._contentHolder.appendChild(newElement);
		
		console.log(newElement);
	};
	
	objectFunctions._createDisplayIframe = function() {
		console.log("Application::setAllReferencesToNull");
		var testIframe = DisplayBaseObject.createNode("iframe", this._contentHolder, true);
		
		console.log(testIframe);
	};
	
	objectFunctions._createTemplateFromExistingElements = function(aElement) {
		dbm.singletons.dbmTemplateManager.registerClassShortcut("VideoView", VideoView);
		dbm.singletons.dbmTemplateManager.registerClassShortcut("BaseButton", BaseButton);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(aElement);
		
		console.log(templateResult);
		
		templateResult.getController("testButton").activate();
		
		console.log(templateResult.mainController);
		console.log(templateResult.getController("contentArea/videoPlayer"));
	};
	
	objectFunctions._createTemplateFromLoadedFile = function(aAsset) {
		var templateElement = aAsset.getData();
		templateElement = dbm.getDocument().adoptNode(templateElement, true);
		this._contentHolder.appendChild(templateElement);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut("VideoView", VideoView);
		dbm.singletons.dbmTemplateManager.registerClassShortcut("BaseButton", BaseButton);

		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(templateElement);

		console.log(templateResult);

		templateResult.getController("testButton").activate();

		console.log(templateResult.mainController);
		console.log(templateResult.getController("contentArea/videoPlayer"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});