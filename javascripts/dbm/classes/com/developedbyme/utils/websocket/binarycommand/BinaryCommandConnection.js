dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Self reference
	var BinaryCommandConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TextEncodingData = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.TextEncodingData");
	var BaseEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.BaseEncoder");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection::_init");
		
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
		
		return this;
	};
	
	objectFunctions.setEncodingDataClass = function(aClass) {
		this._encodingDataClass = aClass;
	};
	
	objectFunctions._createEncodingData = function() {
		return this._encodingDataClass.create();
	};
	
	objectFunctions.createEncoder = function(aMessageType, aPathId) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection::createEncoder");
		//console.log(aMessageType, aPathId);
		
		var newEncoder = BaseEncoder.createWithMessagePrefix(ClassReference._encodeIdPath(aPathId));
		this.addEncoder(aMessageType, aPathId, newEncoder);
		
		return newEncoder;
	};
	
	objectFunctions.addEncoder = function(aMessageType, aPathId, aEncoder) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection::addEncoder");
		
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
					//METODO: error message
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
		
		//METODO: set event performer to encoder
		currentHolder[lastId] = aEncoder;
	};
	
	objectFunctions.getEncoderByName = function(aMessageType) {
		return this._namedEncoders.getItem(aMessageType);
	};
	
	objectFunctions.encodeAndSend = function(aMessageType /* ... aData */) {
		console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection::encodeAndSend");
		console.log(aMessageType);
		
		if(this._namedEncoders.select(aMessageType)) {
			var currentEncoder = this._namedEncoders.currentSelectedItem;
			
			var aData = ArrayFunctions.copyPartOfArray(arguments, 1, arguments.length);
			
			var encodingData = this._createEncodingData().setData(aData).startEncoding();
			
			console.log(currentEncoder);
			currentEncoder.encode(encodingData);
			console.log(encodingData.getEncodedMessage());
			this._connection.send(encodingData.getEncodedMessage());
			currentEncoder.destroy();
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions._getMessageDecoder = function(aDecodingData) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection::_getMessageDecoder");
		//console.log(this._encoders);
		
		var currentHolder = this._encoders;
		var debugCounter = 0;
		while(true) {
			if(debugCounter++ > 500) {
				//METODO: error message
				return null;
			}
			var currentIndex = aDecodingData.getNextByte();
			var selectedItem = currentHolder[currentIndex];
			if(selectedItem instanceof BaseEncoder) {
				return selectedItem;
			}
			else if(!VariableAliases.isSet(selectedItem)) {
				//METODO: error message
				return null;
			}
			currentHolder = selectedItem;
		}
	};
	
	objectFunctions._decodeMessage = function(aMessage) {
		
		var decodingData = this._createEncodingData().setMessage(aMessage).startDecoding();
		
		var decoder = this._getMessageDecoder(decodingData);
		if(decoder === null) {
			//METODO: error message
			return;
		}
		decoder.decode(decodingData);
		var decodedData = decodingData.getDecodedData();
		console.log(decodedData);
		
		var eventDataObject = EventDataObject.create(decodedData, this, this);
		decoder.decodedEventPerformer.perform(eventDataObject);
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