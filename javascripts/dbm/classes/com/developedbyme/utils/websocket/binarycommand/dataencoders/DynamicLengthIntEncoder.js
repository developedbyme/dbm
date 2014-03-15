dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder");
	
	//Self reference
	var DynamicLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder::_init");
		
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