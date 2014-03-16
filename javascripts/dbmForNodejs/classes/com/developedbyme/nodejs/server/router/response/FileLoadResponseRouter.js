/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter");
	//"use strict";
	
	var url = require("url");
	var path = require("path");
	
	var FileLoadResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var BinaryFileAsset = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter::_init");
		
		this.superCall();
		
		this._rootDirectory = "/var/www";
		
		return this;
	};
	
	objectFunctions.setRootDirectory = function(aRootDirectory) {
		this._rootDirectory = aRootDirectory;
		
		return this;
	};
	
	objectFunctions.route = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter::route");
		
		var theRequest = aRoutedData.request;
		
		var currentPath = url.parse(theRequest.url).pathname;
		var filePath = path.resolve(path.join(this._rootDirectory, currentPath));
		
		if(filePath.indexOf(this._rootDirectory) !== 0) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "route", "Trying to access file (" + currentPath + ") outside of root directory(" + this._rootDirectory + ")");
			
			aRoutedData.setError("No access", null);
			
			return RoutedDataStatusTypes.ERROR;
		}
		
		console.log(filePath);
		var loader = BinaryFileAsset.create(filePath);
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._loadingDone, [aRoutedData, loader]));
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._loadingError, [aRoutedData, loader]));
		loader.load();
		
		return RoutedDataStatusTypes.UNKNOWN;
	};
	
	objectFunctions._loadingDone = function(aRoutedData, aLoader) {
		console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter::_loadingDone");
		
		var theResponse = aRoutedData.response;
		
		//METODO: headers
		theResponse.writeHead(200, {});
		theResponse.write(aLoader.getData(), "binary");
		theResponse.end();
		
		aRoutedData.setAsDone();
		
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, aRoutedData);
		}
	};
	
	objectFunctions._loadingError = function(aRoutedData, aLoader) {
		console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter::_loadingError");
		
		//METODO: set error
		
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, aRoutedData);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aRootDirectory) {
		//console.log("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter::create");
		
		var newFileLoadResponseRouter = (new ClassReference()).init();
		
		newFileLoadResponseRouter.setRootDirectory(aRootDirectory);
		
		return newFileLoadResponseRouter;
	};
});