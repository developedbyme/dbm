dbm.registerClass("com.developedbyme.projects.examples.websocket.BinaryCommandEchoApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var BinaryCommandEchoApplication = dbm.importClass("com.developedbyme.projects.examples.websocket.BinaryCommandEchoApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WebSocketConnection = dbm.importClass("com.developedbyme.utils.websocket.WebSocketConnection");
	var BinaryCommandConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var BinaryCommandDebugSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	var BinaryCommandPaths = dbm.importClass("com.developedbyme.constants.websocket.BinaryCommandPaths");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.websocket.BinaryCommandEchoApplication::_init");
		
		this.superCall();
		
		this._webSocket = null;
		this._encodingConnection = null;
		this._addStartFunction(this._connect, ["ws://localhost:8080/dbm/examples/command"]);
		
		return this;
	};
	
	objectFunctions._connect = function(aUrl) {
		console.log("com.developedbyme.projects.examples.websocket.BinaryCommandEchoApplication::_connect");
		
		this._webSocket = WebSocketConnection.create(aUrl);
		this._encodingConnection = BinaryCommandConnection.create(this._webSocket);
		BinaryCommandDebugSetup.setup(this._encodingConnection);
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, LogCommand.createCommand("Connection opened"));
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this._encodingConnection, this._encodingConnection.encodeAndSend, [BinaryCommandPaths.DEBUG_ECHO, "Hello echo!!!"]));
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, LogCommand.createCommand("Connection closed", GetVariableObject.createSelectDataCommand()));
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, LogCommand.createCommand("Error", GetVariableObject.createSelectDataCommand()));
		
		this._webSocket.connect();
		console.log(this._webSocket);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});