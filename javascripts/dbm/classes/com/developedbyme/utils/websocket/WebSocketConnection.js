dbm.registerClass("com.developedbyme.utils.websocket.WebSocketConnection", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.WebSocketConnection");
	
	var WebSocketConnection = dbm.importClass("com.developedbyme.utils.websocket.WebSocketConnection");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var WebSocketFunctions = dbm.importClass("com.developedbyme.utils.websocket.WebSocketFunctions");
	
	var WebSocketConnectionEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.WebSocketConnectionEventIds");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	
	staticFunctions._CONNECTION = "connection";
	staticFunctions._MESSAGE = "message";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.WebSocketConnection::_init");
		
		this.superCall();
		
		this._url = null;
		this._socket = null;
		
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
		this.getExtendedEvent().linkJavascriptEvent(this._socket, WebSocketConnectionEventIds.MESSAGE, MessageExtendedEventIds.MESSAGE, ClassReference._MESSAGE, true);
		
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
			case MessageExtendedEventIds.MESSAGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aUrl) {
		return ClassReference._createAndInitClass(ClassReference).setUrl(aUrl);
	};
});