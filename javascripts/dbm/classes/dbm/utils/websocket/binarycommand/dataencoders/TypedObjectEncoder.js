/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder", "dbm.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder");
	
	//Self reference
	var TypedObjectEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	var ObjectFunctions = dbm.importClass("dbm.utils.native.object.ObjectFunctions");
	
	//Constants
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	var SharedPropertyDataTypes = dbm.importClass("dbm.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder::_init");
		
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