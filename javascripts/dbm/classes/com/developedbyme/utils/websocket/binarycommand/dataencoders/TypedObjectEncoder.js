dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder", "com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder");
	
	//Self reference
	var TypedObjectEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	//Constants
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder::_init");
		
		this.superCall();
		
		this._dataTypeEncoder = LengthEncoder.create();
		this._dataEncoders = new Array();
		
		return this;
	};
	
	objectFunctions.addDataTypeEncoder = function(aDataType, aEncoder) {
		this._dataEncoders[aDataType] = aEncoder;
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		
		var dataValue = aEncodingData.getNextData();
		var javascriptType = ObjectFunctions.typeOfValue(dataValue);
		var dataType;
		switch(javascriptType) {
			case JavascriptObjectTypes.STRING:
				dataType = SharedPropertyDataTypes.STRING;
				break;
			case staticFunctions.TYPE_UNDEFINED:
			case staticFunctions.NON_REAL_TYPE_NULL:
				dataType = SharedPropertyDataTypes.NULL;
				break;
			case staticFunctions.NON_REAL_TYPE_ARRAY:
			case staticFunctions.TYPE_OBJECT:
				dataType = SharedPropertyDataTypes.JSON;
				break;
			case staticFunctions.TYPE_BOOLEAN:
				dataType = SharedPropertyDataTypes.BOOLEAN;
				break;
			case staticFunctions.TYPE_NUMBER:
				//METODO: check for integers
				dataType = SharedPropertyDataTypes.FLOAT_32;
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "encode", "Can't encode " + javascriptType + ".");
				dataType = SharedPropertyDataTypes.NULL;
				break;
		}
		
		this._dataTypeEncoder.encodeValue(dataType, aEncodingData);
		var encoder = this._dataEncoders[dataType];
		encoder.encode(aEncodingData);
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		var dataType = this._dataTypeEncoder.decodeWithoutStore(aDecodingData);
		var decoder = this._dataEncoders[dataType];
		return decoder.decodeWithoutStore(aDecodingData);
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});