dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Self reference
	var LengthEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var FixedLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder::_init");
		
		this.superCall();
		
		this._range2Encoder = this.addDestroyableObject(FixedLengthIntEncoder.create(2, false));
		this._range3Encoder = this.addDestroyableObject(FixedLengthIntEncoder.create(8, false));
		
		return this;
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		
		if(aValue < 0x7E) {
			aEncodingData.addToMessage(aValue);
		}
		else if(aValue < 0x4000) {
			this._range2Encoder.encodeValue(aValue, aEncodingData);
		}
		else if(aValue < 0x100000000000000) {
			this._range3Encoder.encodeValue(aValue, aEncodingData);
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		
		var numericValue = aDecodingData.getNextByte();
		
		if(numericValue < 0x7E) {
			return numericValue;
		}
		else if(numericValue === 0x7E) {
			return this._range2Encoder.decodeWithoutStore(aDecodingData);
		}
		else if(numericValue === 0x7F) {
			return this._range3Encoder.decodeWithoutStore(aDecodingData);
		}
		
		//METODO: error message
		return 0;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._range2Encoder = null;
		this._range3Encoder = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});