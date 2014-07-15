/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.utils.file.FolderCreator", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.utils.file.FolderCreator");
	//"use strict";
	
	var fs = require("fs");
	
	//Self reference
	var FolderCreator = dbm.importClass("com.developedbyme.nodejs.utils.file.FolderCreator");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	//Constants
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	staticFunctions._EXISTS_CALLBACK = "existsCallback";
	staticFunctions._CREATED_CALLBACK = "createdCallback";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.utils.file.FolderCreator::_init");
		
		this.superCall();
		
		this._url = null;
		this._currentUrl = null;
		this._createParts = new Array();
		
		this._existsCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._EXISTS_CALLBACK);
		this.getExtendedEvent().addEventLink(this._existsCallbackEventLink, ClassReference._EXISTS_CALLBACK, true);
		
		this.getExtendedEvent().addCommandToEvent(ClassReference._EXISTS_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_exists, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		
		this._createdCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._CREATED_CALLBACK);
		this.getExtendedEvent().addEventLink(this._createdCallbackEventLink, ClassReference._CREATED_CALLBACK, true);
		
		this.getExtendedEvent().addCommandToEvent(ClassReference._CREATED_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_created, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.create = function() {
		//METODO: check if it's already performing
		this._currentUrl = this._url;
		this._checkIfCurrentFolderExists();
	};
	
	objectFunctions._checkIfCurrentFolderExists = function() {
		//METODO: Needs to lock out other file operations to do this asyncronous
		//fs.exists(this._currentUrl, this._existsCallbackEventLink.getCallbackFunction());
		
		var doesExist = fs.existsSync(this._currentUrl);
		this._callback_exists(doesExist);
	};
	
	objectFunctions._createNextFolder = function() {
		if(this._createParts.length > 0) {
			this._currentUrl += "/" + this._createParts.pop();
			
			//METODO: Needs to lock out other file operations to do this asyncronous
			//fs.mkdir(this._currentUrl, this._createdCallbackEventLink.getCallbackFunction());
			
			fs.mkdirSync(this._currentUrl);
			this._callback_created();
		}
		else {
			if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
				this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE);
			}
		}
	};
	
	objectFunctions._callback_exists = function(aExists) {
		//console.log("com.developedbyme.nodejs.utils.file.FolderCreator::_callback_exists");
		//console.log(this._currentUrl, aExists);
		
		if(!aExists) {
			var lastPartIndex = this._currentUrl.lastIndexOf("/");
			var currentPath = this._currentUrl.substring(lastPartIndex+1, this._currentUrl.length);
			this._createParts.push(currentPath);
			this._currentUrl = this._currentUrl.substring(0, lastPartIndex);
			this._checkIfCurrentFolderExists();
		}
		else {
			this._createNextFolder();
		}
	};
	
	objectFunctions._callback_created = function(aError) {
		//console.log("com.developedbyme.nodejs.utils.file.FolderCreator::_callback_created");
		//console.log(this._currentUrl);
		
		this._createNextFolder();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ClassReference._EXISTS_CALLBACK:
			case ClassReference._CREATED_CALLBACK:
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._url = null;
		this._currentUrl = null;
		this._createParts = null;
		
		this._existsCallbackEventLink = null;
		this._createdCallbackEventLink = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUrl) {
		//console.log("com.developedbyme.nodejs.utils.file.FolderCreator::create");
		//console.log(aUrl);
		
		var newFolderCreator = (new ClassReference()).init();
		
		newFolderCreator.setUrl(aUrl);
		
		return newFolderCreator;
	};
	
	staticFunctions.createFromFilePath = function(aUrl) {
		//console.log("com.developedbyme.nodejs.utils.file.FolderCreator::createFromFilePath");
		//console.log(aUrl);
		
		var newFolderCreator = (new ClassReference()).init();
		
		var folderUrl = aUrl.substring(0, aUrl.lastIndexOf("/"));
		newFolderCreator.setUrl(folderUrl);
		
		return newFolderCreator;
	};
});