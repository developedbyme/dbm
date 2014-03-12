dbm.registerClass("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData", "com.developedbyme.utils.websocket.binarycommand.EncodingData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	//"use strict";
	
	//Self reference
	var BufferEncodingData = dbm.importClass("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.addData = function(aData) {
		this._data.push(aData);
	};
	
	objectFunctions.addToMessage = function(aValue) {
		//METODO
	};
	
	objectFunctions.addStringToMessage = function(aValue) {
		//METODO
	};
	
	objectFunctions.startEncoding = function() {
		//METODO
		this._dataPosition = 0;
		
		return this;
	};
	
	objectFunctions.getNextByte = function() {
		var returnValue = this._message[this._messagePosition];
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