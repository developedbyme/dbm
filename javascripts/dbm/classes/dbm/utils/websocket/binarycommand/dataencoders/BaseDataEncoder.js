/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder");
	
	//Self reference
	var BaseDataEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder");
	
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
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		this.encodeValue(aEncodingData.getNextData(), aEncodingData);
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		aEncodingData.addToMessage(aValue);
	};
	
	objectFunctions.decode = function(aDecodingData) {
		aDecodingData.addData(this.decodeWithoutStore(aDecodingData));
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		//METODO: error message
		//MENOTE: shoud be overridden
		return null;
	};
});