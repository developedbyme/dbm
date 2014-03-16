/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder");
	
	//Self reference
	var StringEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder::_init");
		
		this.superCall();
		
		this._lengthEncoder = LengthEncoder.create();
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		
		var stringValue = aEncodingData.getNextData();
		var length = stringValue.length;
		
		this._lengthEncoder.encodeValue(length, aEncodingData);
		aEncodingData.addStringToMessage(stringValue);
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		var length = this._lengthEncoder.decodeWithoutStore(aDecodingData);
		return aDecodingData.getNextBytesAsUtf8String(length);
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});