/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder", "dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder");
	
	//Self reference
	var DynamicLengthIntEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder::_init");
		
		this.superCall();
		
		this._lengthEncoder = LengthEncoder.create();
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		var testValue = (aValue >= 0) ? aValue : 2*Math.abs(aValue);
		var length = Math.ceil(Math.max(1, NumberFunctions.getBitsRequiredForValue(testValue)/7));
		this._lengthEncoder.encodeValue(length, aEncodingData);
		this._encodeValueWithLength(aValue, aEncodingData, length);
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		var length = this._lengthEncoder.decodeWithoutStore(aDecodingData);
		return this._decodeWithLength(aDecodingData, length);
	};
	
	staticFunctions.create = function(aSigned) {
		
		aSigned = VariableAliases.valueWithDefault(aSigned, false);
		
		return ClassReference._createAndInitClass(ClassReference).setup(aSigned);
	};
});