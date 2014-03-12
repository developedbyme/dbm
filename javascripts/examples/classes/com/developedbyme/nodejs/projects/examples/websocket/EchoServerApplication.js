dbm.registerClass("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var EchoServerApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ConnectWebSocketRouter = dbm.importClass("com.developedbyme.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	var WebSocketServerConnection = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketEncodingFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication::_init");
		
		this.superCall();
		
		this._webServer = null;
		this._conenctions = new Array();
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication::start");
		
		this._webServer = WebServer.create(8080);
		
		var echoApiPoint = ConnectWebSocketRouter.create("/dbm/examples/echo");
		
		echoApiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createEchoConnection, [GetVariableObject.createSelectDataCommand()]));
		
		this._webServer.addUpgradeRouter(echoApiPoint);
		
		this._webServer.start();
	};
	
	objectFunctions._createEchoConnection = function(aApiCallData) {
		console.log("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication::_createEchoConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var newConnection = WebSocketServerConnection.create(nativeSocket, 13); //MEDEBUG: use protocol version instead
		newConnection.getExtendedEvent().addCommandToEvent(MessageExtendedEventIds.MESSAGE, CallFunctionCommand.createCommand(this, this._sendResponse, [newConnection, GetVariableObject.createSelectDataCommand()]));
		this._conenctions.push(newConnection);
		
	};
	
	objectFunctions._sendResponse = function(aConnection, aMessage) {
		console.log("com.developedbyme.nodejs.projects.examples.websocket.EchoServerApplication::_createEchoConnection");
		console.log(aMessage);
		
		aConnection.sendRawText(aMessage.toString("utf8"));
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});