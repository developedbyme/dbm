/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.WebSocketConnection", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.WebSocketConnection");
	
	//Self reference
	var WebSocketConnection = dbm.importClass("dbm.utils.websocket.WebSocketConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Utils
	var WebSocketFunctions = dbm.importClass("dbm.utils.websocket.WebSocketFunctions");
	var PerformExtendedEventCommand = dbm.importClass("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var WebSocketConnectionEventIds = dbm.importClass("dbm.constants.htmlevents.WebSocketConnectionEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MessageExtendedEventIds");
	
	staticFunctions._CONNECTION = "connection";
	staticFunctions._MESSAGE = "message";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.WebSocketConnection::_init");
		
		this.superCall();
		
		this._url = null;
		this._socket = null;
		
		this.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.RAW_DATA, PerformExtendedEventCommand.createCommand(this, MessageExtendedEventIds.MESSAGE, GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "data")));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.connect = function() {
		
		this._socket = WebSocketFunctions.createWebSocket(this._url);
		
		this.getExtendedEvent().linkJavascriptEvent(this._socket, WebSocketConnectionEventIds.OPEN, GenericExtendedEventIds.OPEN, ClassReference._CONNECTION, true);
		this.getExtendedEvent().linkJavascriptEvent(this._socket, WebSocketConnectionEventIds.CLOSE, GenericExtendedEventIds.CLOSE, ClassReference._CONNECTION, true);
		this.getExtendedEvent().linkJavascriptEvent(this._socket, WebSocketConnectionEventIds.ERROR, GenericExtendedEventIds.ERROR, ClassReference._CONNECTION, true);
		this.getExtendedEvent().linkJavascriptEvent(this._socket, WebSocketConnectionEventIds.MESSAGE, GenericExtendedEventIds.RAW_DATA, ClassReference._MESSAGE, true);
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._CONNECTION);
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._MESSAGE);
		
		return this;
	};
	
	objectFunctions.disconnect = function() {
		this._socket.close();
	};
	
	objectFunctions.send = function(aData) {
		this._socket.send(aData);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.OPEN:
			case GenericExtendedEventIds.CLOSE:
			case GenericExtendedEventIds.ERROR:
			case GenericExtendedEventIds.RAW_DATA:
			case MessageExtendedEventIds.MESSAGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aUrl) {
		return ClassReference._createAndInitClass(ClassReference).setUrl(aUrl);
	};
});