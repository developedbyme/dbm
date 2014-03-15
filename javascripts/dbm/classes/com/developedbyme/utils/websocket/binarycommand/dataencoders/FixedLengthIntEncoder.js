dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Self reference
	var FixedLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder::_init");
		
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
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder::_encodeValueWithLength");
		//console.log(aValue, aEncodingData, aLength);
		
		var numericValue = aValue;
		if(this._signed && numericValue < 0) {
			var fullLength = Math.pow(2, 7*(aLength));
			numericValue = fullLength-aValue;
		}
		
		var currentMask = Math.pow(2, 7*(aLength-1))-1;
		
		var length = aLength;
		for(var i = 0; i < length; i++) {
			var rest = numericValue & currentMask;
			var currentValue = (numericValue-rest) >> (7*(length-i-1));
			aEncodingData.addToMessage(currentValue);
			numericValue = rest;
			currentMask >>= 7;
		}
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		this._encodeValueWithLength(aValue, aEncodingData, this._length);
	};
	
	objectFunctions._decodeWithLength = function(aDecodingData, aLength) {
		var returnValue = 0;
		
		var length = aLength;
		for(var i = 0; i < length; i++) {
			returnValue += aDecodingData.getNextByte() * Math.pow(2, 7*(length-i-1));
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