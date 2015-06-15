/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.SharedPropertyEncoder", "dbm.utils.websocket.binarycommand.BaseEncoder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.SharedPropertyEncoder");
	
	//Self reference
	var SharedPropertyEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.SharedPropertyEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var LengthEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.LengthEncoder");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.SharedPropertyEncoder::_init");
		
		this.superCall();
		
		this._indexEncoder = LengthEncoder.create();
		this.addDestroyableObject(this._indexEncoder);
		this._dataTypeDefinition = new Array();
		this._dataTypeEncoders = new Array();
		
		return this;
	};
	
	objectFunctions.addDataEncoder = function(aEncoder) {
		ErrorManager.getInstance().report(ReportTypes.WANING, ReportLevelTypes.NORMAL, this, "addDataEncoder", "Can't add encoders the SharedPropertyEncoder. " + aEncoder + " will be ignored.");
		
		return this;
	};
	
	objectFunctions.addDataTypeEncoder = function(aDataType, aEncoder) {
		this._dataTypeEncoders[aDataType] = aEncoder;
		
		return this;
	};
	
	objectFunctions.setDataTypeForIndex = function(aIndex, aDataType) {
		this._dataTypeDefinition[aIndex] = aDataType;
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		//console.log("dbm.utils.websocket.binarycommand.SharedPropertyEncoder::encode");
		//console.log(this._messagePrefix);
		
		aEncodingData.addStringToMessage(this._messagePrefix);
		
		var index = aEncodingData.getNextData();
		this._indexEncoder.encodeValue(index, aEncodingData);
		
		var dataType = this._dataTypeDefinition[index];
		var dataTypeEncoder = this._dataTypeEncoders[dataType];
		dataTypeEncoder.encode(aEncodingData);
	};
	
	objectFunctions.decode = function(aDecodingData) {
		var index = this._indexEncoder.decodeWithoutStore(aDecodingData);
		aDecodingData.addData(index);
		
		var dataType = this._dataTypeDefinition[index];
		
		if(!VariableAliases.isSet(dataType)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "decode", "No data type specified for index " + index + ". Can't decode.");
			aDecodingData.addData(null);
			return;
		}
		
		var dataTypeDecoder = this._dataTypeEncoders[dataType];
		dataTypeDecoder.decode(aDecodingData);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._indexEncoder = null;
		this._dataTypeDefinition = null;
		this._dataTypeEncoders = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});