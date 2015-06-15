/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData", "dbm.utils.websocket.binarycommand.EncodingData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	//"use strict";
	
	//Self reference
	var BufferEncodingData = dbm.importClass("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData::_init");
		
		this.superCall();
		
		this._messageString = null;
		
		return this;
	};
	
	objectFunctions.addData = function(aData) {
		//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData::addData");
		this._data.push(aData);
	};
	
	objectFunctions.addToMessage = function(aValue) {
		//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData::addToMessage");
		//console.log(aValue);
		this._messageString += String.fromCharCode(aValue);
	};
	
	objectFunctions.addStringToMessage = function(aValue) {
		//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData::addStringToMessage");
		//console.log(aValue);
		this._messageString += aValue;
	};
	
	objectFunctions.startEncoding = function() {
		this._message = null;
		this._messageString = "";
		this._dataPosition = 0;
		
		return this;
	};
	
	objectFunctions.getEncodedMessage = function() {
		if(this._message === null) {
			this._message = new Buffer(this._messageString, "utf8");
		}
		return this._message;
	};
	
	objectFunctions.getNextByte = function() {
		//console.log("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData::getNextByte");
		var returnValue = this._message[this._messagePosition];
		//console.log(this._messagePosition, this._message, this._message[this._messagePosition]);
		this._messagePosition++;
		return returnValue;
	};
	
	objectFunctions._getNextUtf8Charcter = function() {
		//METODO
	};
	
	objectFunctions.getNextBytesAsUtf8String = function(aLength) {
		//METODO: fix so that this handle multibytes characters
		var returnValue = this._message.slice(this._messagePosition, this._messagePosition+aLength).toString("utf8");
		
		this._messagePosition += aLength;
		return returnValue;
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
	
	staticFunctions.createEncoding = function(aDataArray) {
		return ClassReference._createAndInitClass(ClassReference).setData(aDataArray).startEncoding();
	};
	
	staticFunctions.createDecoding = function(aMessage) {
		return ClassReference._createAndInitClass(ClassReference).setMessage(aMessage).startDecoding();
	};
});