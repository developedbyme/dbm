/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.setup.SharedPropertyDataTypesSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.setup.SharedPropertyDataTypesSetup");
	
	//Self reference
	var SharedPropertyDataTypesSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.SharedPropertyDataTypesSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var StringEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder");
	var FixedLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.FixedLengthIntEncoder");
	var DynamicLengthIntEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.DynamicLengthIntEncoder");
	var BooleanEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.BooleanEncoder");
	var NumberEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.NumberEncoder");
	var TypedObjectEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.TypedObjectEncoder");
	var NullEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.NullEncoder");
	
	//Utils
	
	//Constants
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	staticFunctions._addToEncoders = function(aDataType, aDataEncoder, aEncoder, aAnyEncoder) {
		aEncoder.addDataTypeEncoder(aDataType, aDataEncoder);
		aAnyEncoder.addDataTypeEncoder(aDataType, aDataEncoder);
	};
	
	staticFunctions.setup = function(aEncoder) {
		
		var anyEncoder = TypedObjectEncoder.create();
		aEncoder.addDataTypeEncoder(SharedPropertyDataTypes.ANY, anyEncoder);
		
		ClassReference._addToEncoders(SharedPropertyDataTypes.STRING, StringEncoder.create(), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.BOOLEAN, BooleanEncoder.create(), aEncoder, anyEncoder);
		
		ClassReference._addToEncoders(SharedPropertyDataTypes.UINT, DynamicLengthIntEncoder.create(false), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.INT, DynamicLengthIntEncoder.create(true), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.FLOAT_32, NumberEncoder.create(), aEncoder, anyEncoder);
		//METODO: float64
		ClassReference._addToEncoders(SharedPropertyDataTypes.NULL, NullEncoder.create(), aEncoder, anyEncoder);
		
		ClassReference._addToEncoders(SharedPropertyDataTypes.UINT_7, FixedLengthIntEncoder.create(1, false), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.UINT_14, FixedLengthIntEncoder.create(2, false), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.UINT_28, FixedLengthIntEncoder.create(4, false), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.UINT_56, FixedLengthIntEncoder.create(8, false), aEncoder, anyEncoder);
		
		ClassReference._addToEncoders(SharedPropertyDataTypes.INT_7, FixedLengthIntEncoder.create(1, true), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.INT_14, FixedLengthIntEncoder.create(2, true), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.INT_28, FixedLengthIntEncoder.create(4, true), aEncoder, anyEncoder);
		ClassReference._addToEncoders(SharedPropertyDataTypes.INT_56, FixedLengthIntEncoder.create(8, true), aEncoder, anyEncoder);
		
		//METODO: complex items
	};
});