/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.EncodingData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.EncodingData");
	
	//Self reference
	var EncodingData = dbm.importClass("dbm.utils.websocket.binarycommand.EncodingData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.EncodingData::_init");
		
		this.superCall();
		
		this._data = null;
		this._dataPosition = 0;
		
		this._message = null;
		this._messagePosition = 0;
		
		return this;
	};
	
	objectFunctions.setData = function(aDataArray) {
		this._data = aDataArray;
		
		return this;
	};
	
	objectFunctions.getDecodedData = function() {
		return this._data;
	};
	
	objectFunctions.setMessage = function(aMessage) {
		this._message = aMessage;
		
		return this;
	};
	
	objectFunctions.getEncodedMessage = function() {
		return this._message;
	};
	
	objectFunctions.addData = function(aData) {
		this._data.push(aData);
		
		return this;
	};
	
	objectFunctions.addToMessage = function(aValue) {
		//MENOTE: should be overridden
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addToMessage", "Method should have been overridden.");
	};
	
	objectFunctions.addStringToMessage = function(aValue) {
		//MENOTE: should be overridden
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addStringToMessage", "Method should have been overridden.");
	};
	
	objectFunctions.startEncoding = function() {
		//MENOTE: should be overridden
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "startEncoding", "Method should have been overridden.");
		
		return this;
	};
	
	objectFunctions.startDecoding = function() {
		this._data = new Array();
		this._messagePosition = 0;
		
		return this;
	};
	
	objectFunctions.getNextData = function() {
		var returnValue = this._data[this._dataPosition];
		this._dataPosition++;
		
		return returnValue;
	};
	
	objectFunctions.getNextByte = function() {
		
		//MENOTE: should be overridden
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getNextByte", "Method should have been overridden.");
		
		return 0;
	};
	
	objectFunctions.getNextBytesAsUtf8String = function(aLength) {
		
		//MENOTE: should be overridden
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getNextBytesAsUtf8String", "Method should have been overridden.");
		
		this._messagePosition += aLength;
		return "";
	};
	
	objectFunctions.skipBytes = function(aLength) {
		this._messagePosition += aLength;
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._data = null;
		this._message = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});