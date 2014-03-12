dbm.registerClass("com.developedbyme.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var BinaryCommandEchoServerApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ConnectWebSocketRouter = dbm.importClass("com.developedbyme.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	var WebSocketServerConnection = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection");
	var BinaryCommandConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection");
	var BufferEncodingData = dbm.importClass("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketEncodingFunctions");
	var BinaryCommandDebugSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::_init");
		
		this.superCall();
		
		this._webServer = null;
		this._conenctions = new Array();
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::start");
		
		this._webServer = WebServer.create(8080);
		
		var apiPoint = ConnectWebSocketRouter.create("/dbm/examples/command");
		
		apiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createConnection, [GetVariableObject.createSelectDataCommand()]));
		
		this._webServer.addUpgradeRouter(apiPoint);
		
		this._webServer.start();
	};
	
	objectFunctions._createConnection = function(aApiCallData) {
		//console.log("com.developedbyme.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::_createConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var newConnection = BinaryCommandConnection.create(WebSocketServerConnection.create(nativeSocket, 13)); //MEDEBUG: use protocol version instead
		newConnection.setEncodingDataClass(BufferEncodingData);
		BinaryCommandDebugSetup.setup(newConnection);
		//METODO: listen to echo command
		//newConnection.getExtendedEvent().addCommandToEvent(MessageExtendedEventIds.DECODED_MESSAGE, CallFunctionCommand.createCommand(this, this._sendResponse, [newConnection, GetVariableObject.createSelectDataCommand()]));
		this._conenctions.push(newConnection);
		
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});