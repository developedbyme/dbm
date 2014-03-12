dbm.registerClass("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection");
	//"use strict";
	
	//Self reference
	var WebSocketServerConnection = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketEncodingFunctions");
	
	//Constants
	var WebSocketServerConnectionEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.WebSocketServerConnectionEventIds");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	var WebSocketOpcodeIds = dbm.importClass("com.developedbyme.nodejs.constants.WebSocketOpcodeIds");
	
	staticFunctions._CONNECTION = "connection";
	staticFunctions._DATA = "data";
	staticFunctions._CLOSE_MESSAGE = "closeMessage";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		
		this.superCall();
		
		this._lastFrameType = null;
		this._nativeSocket = null;
		this._protocolVersion = -1;
		this._remainingBuffer = null;
		
		return this;
	};
	
	objectFunctions.setNativeSocket = function(aNativeSocket, aProtocolVersion) {
		this._nativeSocket = aNativeSocket;
		this._protocolVersion = aProtocolVersion;
		
		this.getExtendedEvent().linkJavascriptEvent(this._nativeSocket, WebSocketServerConnectionEventIds.DATA, GenericExtendedEventIds.RAW_DATA, ClassReference._DATA, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeSocket, WebSocketServerConnectionEventIds.ERROR, GenericExtendedEventIds.ERROR, ClassReference._CONNECTION, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeSocket, WebSocketServerConnectionEventIds.TIMEOUT, GenericExtendedEventIds.TIMEOUT, ClassReference._CONNECTION, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeSocket, WebSocketServerConnectionEventIds.END, GenericExtendedEventIds.END, ClassReference._CONNECTION, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeSocket, WebSocketServerConnectionEventIds.CLOSE, GenericExtendedEventIds.CLOSE, ClassReference._CONNECTION, true, false);
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._CONNECTION);
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._DATA);
		
		return this;
	};
	
	objectFunctions.setupDefaultDecodingAndResponse = function() {
		this.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.RAW_DATA, CallFunctionCommand.createCommand(this, this._handleRawData, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		this.getExtendedEvent().addCommandToEvent(MessageExtendedEventIds.PING, CallFunctionCommand.createCommand(this, this.sendRawBuffer, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), WebSocketOpcodeIds.PONG]));
		this.getExtendedEvent().addCommandToEvent(ClassReference._CLOSE_MESSAGE, CallFunctionCommand.createCommand(this, this.sendRawBuffer, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), WebSocketOpcodeIds.CLOSE]));
		
		
		return this;
	};
	
	objectFunctions._handleRawData = function(aData) {
		var currentBuffer = aData;
		if(this._remainingBuffer != null) {
			currentBuffer = new Buffer(this._remainingBuffer.length+aData.length);
			this._remainingBuffer.copy(currentBuffer, 0, 0, this._remainingBuffer.length);
			aData.copy(currentBuffer, this._remainingBuffer.length, 0, aData.length);
			this._remainingBuffer = null;
		}
		
		var currentDataLength = WebSocketEncodingFunctions.getAvailableDataLength(this._protocolVersion, currentBuffer);
		
		if(currentDataLength === -1) {
			this._nativeSocket.end();
			return;
		}
		else if(!(currentDataLength > 0)) {
			this._remainingBuffer = currentBuffer;
			return;
		}
		else if(currentDataLength < currentBuffer.length) {
			this._remainingBuffer = currentBuffer.slice(currentDataLength, currentBuffer.length);
			currentBuffer = currentBuffer.slice(0, currentDataLength);
		}
		
		var currentArray = new Array();
		WebSocketEncodingFunctions.splitMessages(this._protocolVersion, currentBuffer, currentArray);
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			this._handleRawFrame(currentArray[i]);
		}
	};
	
	objectFunctions._handleRawFrame = function(aFrame) {
		//console.log("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection::_handleRawFrame");
		var opcode = WebSocketEncodingFunctions.decodeOpcode(this._protocolVersion, aFrame);
		var eventName = null;
		switch(opcode) {
			case WebSocketOpcodeIds.CONTINUATION:
				eventName = this._lastFrameType;
				break;
			case WebSocketOpcodeIds.TEXT:
			case WebSocketOpcodeIds.BINARY:
				eventName = MessageExtendedEventIds.MESSAGE;
				break;
			case WebSocketOpcodeIds.CLOSE:
				eventName = ClassReference._CLOSE_MESSAGE;
				break;
			case WebSocketOpcodeIds.PING:
				eventName = MessageExtendedEventIds.PING;
				break;
			case WebSocketOpcodeIds.PONG:
				eventName = MessageExtendedEventIds.PONG;
				break;
			default:
				//METODO: error message
				return;
		}
		
		this._lastFrameType = eventName;
		
		var decodedData = WebSocketEncodingFunctions.decodeMessages(this._protocolVersion, aFrame);
		
		if(this.getExtendedEvent().hasEvent(eventName)) {
			this.getExtendedEvent().perform(eventName, decodedData);
		}
	};
	
	objectFunctions.send = function(aBuffer) {
		this.sendRawFrame(WebSocketEncodingFunctions.encodeFrame(this._protocolVersion, aBuffer));
	};
	
	objectFunctions.sendRawBuffer = function(aBuffer, aOpcode) {
		this.sendRawFrame(WebSocketEncodingFunctions.encodeFrame(this._protocolVersion, aBuffer, aOpcode));
	};
	
	objectFunctions.sendRawText = function(aText) {
		//console.log("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection::sendRawText");
		//console.log(aText);
		
		var newFrame = WebSocketEncodingFunctions.encodeUtf8Message(this._protocolVersion, aText);
		//console.log(newFrame);
		this.sendRawFrame(newFrame);
	};
	
	objectFunctions.sendRawFrame = function(aFrame) {
		this._nativeSocket.write(aFrame);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.RAW_DATA:
			case GenericExtendedEventIds.ERROR:
			case GenericExtendedEventIds.TIMEOUT:
			case GenericExtendedEventIds.CLOSE:
			case GenericExtendedEventIds.END:
			case MessageExtendedEventIds.MESSAGE:
			case MessageExtendedEventIds.PING:
			case MessageExtendedEventIds.PONG:
			case ClassReference._CLOSE_MESSAGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aNativeSocket, aProtocolVersion) {
		var newWebSocketServerConnection = ClassReference._createAndInitClass(ClassReference);
		newWebSocketServerConnection.setNativeSocket(aNativeSocket, aProtocolVersion);
		newWebSocketServerConnection.setupDefaultDecodingAndResponse();
		return newWebSocketServerConnection;
	};
});