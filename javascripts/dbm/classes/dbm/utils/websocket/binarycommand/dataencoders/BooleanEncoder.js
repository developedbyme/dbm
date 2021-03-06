/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.BooleanEncoder", "dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.BooleanEncoder");
	
	//Self reference
	var BooleanEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.BooleanEncoder");
	
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
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.BooleanEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		
		var numericValue = aValue;
		aEncodingData.addToMessage((aValue & 0x01) === 1);
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		var returnValue = (aDecodingData.getNextByte()) ? 0x01 : 0x00;
		
		return returnValue;
	};
	
	staticFunctions.create = function() {
		
		return ClassReference._createAndInitClass(ClassReference);
	};
});