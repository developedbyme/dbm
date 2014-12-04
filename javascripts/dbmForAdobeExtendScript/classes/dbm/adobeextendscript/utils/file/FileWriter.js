/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.utils.file.FileWriter", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.utils.file.FileWriter");
	//"use strict";
	
	//Self reference
	var FileWriter = dbm.importClass("dbm.adobeextendscript.utils.file.FileWriter");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	staticFunctions._IO_CALLBACK = "ioCallback";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.utils.file.FileWriter::_init");
		
		this.superCall();
		
		this._url = null;
		this._data = null;
		this._flag = "w";
		this._encoding = "UTF-8";
		this._lineFeed = "Unix";
		this._forceWrite = false; //METODO: use this
		
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
	
	objectFunctions.setEncoding = function(aEncoding, aLineFeed) {
		this._encoding = aEncoding;
		this._lineFeed = aLineFeed;
		
		return this;
	};
	
	objectFunctions.write = function() {
		
		this._performWriteFile();
		
		return this;
	};
	
	objectFunctions._performWriteFile = function() {
		//console.log("dbm.adobeextendscript.utils.file.FileWriter::_performWriteFile");
		
		//METODO: add folders
		var theFile = new File(this._url);
		theFile.open(this._flag);
		theFile.encoding = this._encoding;
		theFile.lineFeed = this._lineFeed;
		theFile.write(this._data);
		theFile.close();
		
		if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.SAVED)) {
			this.getExtendedEvent().perform(LoadingExtendedEventIds.SAVED);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.SAVED:
			case LoadingExtendedEventIds.SAVING_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._url = null;
		this._data = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUrl) {
		//console.log("dbm.adobeextendscript.utils.file.FileWriter::create");
		//console.log(aUrl);
		
		var newFileWriter = (new ClassReference()).init();
		
		newFileWriter.setUrl(aUrl);
		
		return newFileWriter;
	};
	
	staticFunctions.createWithPrompt = function(aDefaultFilePath, aPromptText) {
		
		aPromptText = VariableAliases.valueWithDefault(aPromptText, "Save file");
		
		var selectFile = (VariableAliases.isSet(aDefaultFilePath)) ? new File(aDefaultFilePath) : new File();
		var resultFile = selectFile.saveDlg(aPromptText);
		if(resultFile === null) {
			return null;
		}
		return ClassReference.create(resultFile.absoluteURI);
	};
});