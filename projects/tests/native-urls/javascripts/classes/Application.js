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
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Dependencies
	
	//Utils
	var NativeAppUrlGenerator = dbm.importClass("dbm.utils.file.NativeAppUrlGenerator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._addTemplate("main", "assets/templates.html#main");
		this._addTemplate("urlExample", "assets/templates.html#urlExample");
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var templateResult = this._createControllerFromTemplate("main");
		var mainController = templateResult.mainController;
		var mainHolderElement = templateResult.rootElement;
		
		var services = NamedArray.create(true);
		
		services.addObject("SMS", NativeAppUrlGenerator.getSmsUrl("+461234567890"));
		services.addObject("SMS (with message)", NativeAppUrlGenerator.getSmsUrl("+461234567890", "Hello there!"));
		services.addObject("SMS (message without number)", NativeAppUrlGenerator.getSmsUrl("", "Hello there!"));
		
		var currentArray = services.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			//METODO
			var currentName = currentArray[i];
			var currentUrl = services.getObject(currentName);
			var templateResult = this._createControllerFromTemplate("urlExample", mainHolderElement);
			
			var nameObject = templateResult.getController("name");
			nameObject.getProperty("text").setValue(currentName);
			
			var urlObject = templateResult.getController("url");
			urlObject.getProperty("url").setValue(currentUrl);
			urlObject.getProperty("display").update();
			
			var urlTextObject = templateResult.getController("urlText");
			urlTextObject.getProperty("text").setValue(currentUrl);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});