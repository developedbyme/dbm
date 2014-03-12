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
		this._initialMask = 0;
		
		return this;
	};
	
	objectFunctions.setup = function(aLength, aSigned) {
		
		this._length = aLength;
		this._signed = aSigned;
		
		this._initialMask = Math.pow(2, 7*(this._length-1))-1;
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		
		var numericValue = aValue;
		if(this._signed) {
			//METODO
		}
		
		var currentMask = this._initialMask;
		
		var length = this._length;
		for(var i = 0; i < length; i++) {
			var rest = numericValue & currentMask;
			var currentValue = (numericValue-rest) >> (7*(length-i-1));
			aEncodingData.addToMessage(currentValue);
			numericValue = rest;
			currentMask >> 7;
		}
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		var returnValue = 0;
		
		var length = this._length;
		for(var i = 0; i < length; i++) {
			returnValue += aDecodingData.getNextByte() * Math.pow(2, 7*(length-i-1));
		}
		
		if(this._signed) {
			//METODO
		}
		
		return returnValue;
	};
	
	staticFunctions.create = function(aLength, aSigned) {
		
		aLength = VariableAliases.valueWithDefault(aLength, 1);
		aSigned = VariableAliases.valueWithDefault(aSigned, false);
		
		return ClassReference._createAndInitClass(ClassReference).setup(aLength, aSigned);
	};
});