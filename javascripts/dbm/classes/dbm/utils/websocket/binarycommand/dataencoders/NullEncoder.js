/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.NullEncoder", "dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.NullEncoder");
	
	//Self reference
	var NullEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.NullEncoder");
	
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
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.NullEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		aEncodingData.addToMessage(0x00); //MENOTE: ignore value
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		aDecodingData.getNextByte(); //MENOTE: ignore value
		return null;
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});