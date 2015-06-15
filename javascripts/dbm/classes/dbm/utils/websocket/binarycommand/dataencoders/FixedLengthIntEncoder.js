/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder", "dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Self reference
	var FixedLengthIntEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder::_init");
		
		this.superCall();
		
		this._length = 1;
		this._signed = false;
		
		return this;
	};
	
	objectFunctions.setSigned = function(aSigned) {
		this._signed = aSigned;
		
		return this;
	};
	
	objectFunctions.setup = function(aLength, aSigned) {
		
		this._length = aLength;
		this._signed = aSigned;
		
		return this;
	};
	
	objectFunctions._encodeValueWithLength = function(aValue, aEncodingData, aLength) {
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder::_encodeValueWithLength");
		//console.log(aValue, aEncodingData, aLength);
		
		var numericValue = aValue;
		if(this._signed && numericValue < 0) {
			var fullLength = Math.pow(2, 7*(aLength));
			numericValue = fullLength-aValue;
		}
		
		var currentMask = Math.pow(2, 7*(aLength-1))-1;
		
		var length = aLength;
		for(var i = 0; i < length; i++) {
			var currentValue = Math.floor(numericValue/Math.pow(2, 7*(length-i-1)));
			var rest = numericValue - (currentValue) * Math.pow(2, 7*(length-i-1));
			//console.log(i, Math.pow(2, 7*(length-i-1)), currentValue, numericValue, currentMask);
			aEncodingData.addToMessage(currentValue);
			numericValue = rest;
			currentMask >>= 7;
		}
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		this._encodeValueWithLength(aValue, aEncodingData, this._length);
	};
	
	objectFunctions._decodeWithLength = function(aDecodingData, aLength) {
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder::_decodeWithLength");
		//console.log(aLength);
		var returnValue = 0;
		
		var length = aLength;
		for(var i = 0; i < length; i++) {
			var nextByte = aDecodingData.getNextByte();
			returnValue += nextByte * Math.pow(2, 7*(length-i-1));
		}
		
		if(this._signed) {
			var fullLength = Math.pow(2, 7*(aLength));
			if(returnValue > 0.5*fullLength) {
				returnValue -= fullLength;
			}
		}
		
		return returnValue;
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		return this._decodeWithLength(aDecodingData, this._length);
	};
	
	staticFunctions.create = function(aLength, aSigned) {
		
		aLength = VariableAliases.valueWithDefault(aLength, 1);
		aSigned = VariableAliases.valueWithDefault(aSigned, false);
		
		return ClassReference._createAndInitClass(ClassReference).setup(aLength, aSigned);
	};
});