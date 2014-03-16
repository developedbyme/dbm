/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder");
	
	//Self reference
	var NumberEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var FixedLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Utils
	var FloatEncoder = dbm.importClass("com.developedbyme.utils.native.number.FloatEncoder");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder::_init");
		
		this.superCall();
		
		this._intEncoder = FixedLengthIntEncoder.create(5, false);
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder::encodeValue");
		var encodedValue = FloatEncoder.encodeBinary32(aValue)
		//console.log(aValue, encodedValue, encodedValue.toString(2), encodedValue.toString(2).length, FloatEncoder.decodeBinary32(encodedValue));
		
		this._intEncoder.encodeValue(FloatEncoder.encodeBinary32(aValue), aEncodingData);
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder::decodeWithoutStore");
		
		var intValue = this._intEncoder.decodeWithoutStore(aDecodingData);
		//console.log(intValue, FloatEncoder.decodeBinary32(intValue));
		return FloatEncoder.decodeBinary32(intValue);
	};
	
	staticFunctions.create = function() {
		
		return ClassReference._createAndInitClass(ClassReference);
	};
});