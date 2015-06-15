/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.BinaryCommandConnection", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Self reference
	var BinaryCommandConnection = dbm.importClass("dbm.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var TextEncodingData = dbm.importClass("dbm.utils.websocket.binarycommand.TextEncodingData");
	var BaseEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.BaseEncoder");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var MessageExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MessageExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::_init");
		
		this.superCall();
		
		this._connection = null;
		this._namedEncoders = NamedArray.create(true);
		this.addDestroyableObject(this._namedEncoders);
		this._encoders = new Array(127);
		this._encodingDataClass = TextEncodingData;
		
		return this;
	};
	
	objectFunctions.setConnection = function(aConnection) {
		this._connection = aConnection;
		this._connection.getExtendedEvent().addCommandToEvent(MessageExtendedEventIds.MESSAGE, CallFunctionCommand.createCommand(this, this._decodeMessage, [GetVariableObject.createSelectDataCommand()]));
		this.addDestroyableObject(this._connection);
		
		return this;
	};
	
	objectFunctions.setEncodingDataClass = function(aClass) {
		this._encodingDataClass = aClass;
	};
	
	objectFunctions._createEncodingData = function() {
		return this._encodingDataClass.create();
	};
	
	objectFunctions.createEncoder = function(aMessageType, aPathId) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::createEncoder");
		//console.log(aMessageType, aPathId);
		
		var newEncoder = BaseEncoder.createWithMessagePrefix(ClassReference._encodeIdPath(aPathId));
		this.addEncoder(aMessageType, aPathId, newEncoder);
		
		return newEncoder;
	};
	
	objectFunctions.addEncoder = function(aMessageType, aPathId, aEncoder) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::addEncoder");
		
		this._namedEncoders.addObject(aMessageType, aEncoder);
		
		var currentHolder = this._encoders;
		var currentArray = aPathId;
		var currentArrayLength = currentArray.length-1; //MENOTE: last id is adding the encoder
		var lastId = currentArray[currentArrayLength];
		for(var i = 0; i < currentArrayLength; i++) {
			var currentId = currentArray[i];
			var newHolder = currentHolder[currentId];
			if(VariableAliases.isSet(newHolder)) {
				if(!(newHolder instanceof Array)) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "addEncoder", "Encoder for " + aMessageType + " is obstructed on path " + aPathId + ".");
					return;
				}
			}
			else {
				newHolder = new Array(127);
				currentHolder[currentId] = newHolder;
			}
			currentHolder = newHolder;
		}
		
		var eventPerformer = this.getExtendedEvent().createEvent(MessageExtendedEventIds.DECODED_MESSAGE + "/" + aMessageType);
		aEncoder.decodedEventPerformer = eventPerformer;
		
		currentHolder[lastId] = aEncoder;
	};
	
	objectFunctions.getEncoderByName = function(aMessageType) {
		return this._namedEncoders.getItem(aMessageType);
	};
	
	objectFunctions.encodeAndSend = function(aMessageType /* ... aData */) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::encodeAndSend");
		//console.log(aMessageType);
		
		if(this._namedEncoders.select(aMessageType)) {
			var currentEncoder = this._namedEncoders.currentSelectedItem;
			
			var aData = ArrayFunctions.copyPartOfArray(arguments, 1, arguments.length);
			this.performEncodeAndSend(this._namedEncoders.currentSelectedItem, aData);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "encodeAndSend", "Encoder " + aMessageType + " doesn't exist.");
		}
	};
	
	objectFunctions.performEncodeAndSend = function(aEncoder, aData) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::performEncodeAndSend");
		//console.log(aEncoder, aData);
		var encodingData = this._createEncodingData().setData(aData).startEncoding();
		
		//console.log(currentEncoder);
		aEncoder.encode(encodingData);
		//console.log(encodingData.getEncodedMessage());
		this._connection.send(encodingData.getEncodedMessage());
		encodingData.destroy();
	}
	
	objectFunctions._getMessageDecoder = function(aDecodingData) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::_getMessageDecoder");
		//console.log(this._encoders);
		
		var currentHolder = this._encoders;
		var debugCounter = 0;
		var debugPath = "";
		while(true) {
			if(debugCounter++ > 500) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_getMessageDecoder", "Loop has been running for too long.");
				return null;
			}
			var currentIndex = aDecodingData.getNextByte();
			var selectedItem = currentHolder[currentIndex];
			if(selectedItem instanceof BaseEncoder) {
				return selectedItem;
			}
			else if(!VariableAliases.isSet(selectedItem)) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_getMessageDecoder", "No decoder exists for " + debugPath + currentIndex.toString() + ".");
				return null;
			}
			debugPath += currentIndex.toString() + "/";
			currentHolder = selectedItem;
		}
	};
	
	objectFunctions._decodeMessage = function(aMessage) {
		//console.log("dbm.utils.websocket.binarycommand.BinaryCommandConnection::_decodeMessage");
		
		var decodingData = this._createEncodingData().setMessage(aMessage).startDecoding();
		
		var decoder = this._getMessageDecoder(decodingData);
		if(decoder === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_decodeMessage", "No decoder exists for message " + aMessage + ".");
			return;
		}
		decoder.decode(decodingData);
		var decodedData = decodingData.getDecodedData();
		decodingData.destroy();
		//console.log(decodedData);
		
		var eventDataObject = EventDataObject.create(decodedData, this, this);
		decoder.decodedEventPerformer.perform(eventDataObject);
	};
	
	objectFunctions.encodeIdPath = function(aPath) {
		return ClassReference._encodeIdPath(aPath);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._connection = null;
		this._namedEncoders = null;
		this._encoders = null;
		this._encodingDataClass = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aConnection) {
		return ClassReference._createAndInitClass(ClassReference).setConnection(aConnection);
	};
	
	staticFunctions._encodeIdPath = function(aPath) {
		var returnString = "";
		var currentArray = aPath;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			returnString += String.fromCharCode(currentArray[i]);
		}
		return returnString;
	};
});