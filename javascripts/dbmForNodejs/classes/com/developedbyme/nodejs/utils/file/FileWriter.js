/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.utils.file.FileWriter", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.utils.file.FileWriter");
	//"use strict";
	
	var fs = require("fs");
	
	//Self reference
	var FileWriter = dbm.importClass("com.developedbyme.nodejs.utils.file.FileWriter");
	
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
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	staticFunctions._IO_CALLBACK = "ioCallback";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.utils.file.FileWriter::_init");
		
		this.superCall();
		
		this._url = null;
		this._data = null;
		this._encoding = "utf8";
		this._mode = 438;
		this._flag = "w";
		this._forceWrite = false; //METODO: use this
		//METODO: add folders
		
		this._callbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._IO_CALLBACK);
		this.getExtendedEvent().addEventLink(this._callbackEventLink, ClassReference._IO_CALLBACK, true);
		
		this.getExtendedEvent().addCommandToEvent(ClassReference._IO_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_ioDone, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.setData = function(aData) {
		this._data = aData;
		
		return this;
	};
	
	objectFunctions.write = function() {
		var optionsObject = new Object();
		optionsObject["encoding"] = this._encoding;
		optionsObject["mode"] = this._mode;
		optionsObject["flag"] = this._flag;
		
		fs.writeFile(this._url, this._data, optionsObject, this._callbackEventLink.getCallbackFunction());
		
		return this;
	};
	
	objectFunctions._callback_ioDone = function(aError) {
		console.log("com.developedbyme.nodejs.utils.file.FileWriter::_callback_ioDone");
		console.log(aError);
		
		if(aError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "_callback_ioDone", "Error saving data to " + this._url + ".");
			ErrorManager.getInstance().reportError(this, "_callback_ioDone", aError);
			
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.SAVING_ERROR)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.SAVING_ERROR, aError);
			}
		}
		else {
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.SAVED)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.SAVED);
			}
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ClassReference._IO_CALLBACK:
			case LoadingExtendedEventIds.SAVED:
			case LoadingExtendedEventIds.SAVING_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUrl) {
		//console.log("com.developedbyme.nodejs.utils.file.FileWriter::create");
		//console.log(aElement);
		
		var newFileWriter = (new ClassReference()).init();
		
		newFileWriter.setUrl(aUrl);
		
		return newFileWriter;
	};
});