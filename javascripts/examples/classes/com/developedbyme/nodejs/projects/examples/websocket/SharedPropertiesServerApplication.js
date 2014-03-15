dbm.registerClass("com.developedbyme.nodejs.projects.examples.websocket.SharedPropertiesServerApplication", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SharedPropertiesServerApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.websocket.SharedPropertiesServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ConnectWebSocketRouter = dbm.importClass("com.developedbyme.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	var WebSocketServerConnection = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketServerConnection");
	var SharedPropertiesConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection");
	var BufferEncodingData = dbm.importClass("com.developedbyme.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("com.developedbyme.nodejs.utils.websocket.WebSocketEncodingFunctions");
	var BinaryCommandFlowSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.websocket.SharedPropertiesServerApplication::_init");
		
		this.superCall();
		
		this._webServer = null;
		this._connections = new Array();
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.websocket.SharedPropertiesServerApplication::start");
		
		this._webServer = WebServer.create(8080);
		
		var apiPoint = ConnectWebSocketRouter.create("/dbm/examples/command");
		
		apiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createConnection, [GetVariableObject.createSelectDataCommand()]));
		
		this._webServer.addUpgradeRouter(apiPoint);
		
		this._webServer.start();
	};
	
	objectFunctions._createConnection = function(aApiCallData) {
		//console.log("com.developedbyme.nodejs.projects.examples.websocket.SharedPropertiesServerApplication::_createConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var newConnection = SharedPropertiesConnection.create(WebSocketServerConnection.create(nativeSocket, 13)); //MEDEBUG: use protocol version instead
		newConnection.setEncodingDataClass(BufferEncodingData);
		BinaryCommandFlowSetup.setup(newConnection);
		
		var xInProperty = newConnection.createSharedProperty("xIn", 0, 0, SharedPropertyDataTypes.UINT_14);
		var yInProperty = newConnection.createSharedProperty("yIn", 1, 0, SharedPropertyDataTypes.UINT_14);
		
		var xAdditionNode = AdditionNode.create(xInProperty, 10);
		var yAdditionNode = AdditionNode.create(yInProperty, 10);
		
		var xOutProperty = newConnection.createSharedProperty("xOut", 2, xAdditionNode.getProperty("outputValue"), SharedPropertyDataTypes.UINT_14);
		var yOutProperty = newConnection.createSharedProperty("yOut", 3, yAdditionNode.getProperty("outputValue"), SharedPropertyDataTypes.UINT_14);
		
		this._connections.push(newConnection);
		
		newConnection.startUpdatingTransfer();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._webServer = null;
		this._connections = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});