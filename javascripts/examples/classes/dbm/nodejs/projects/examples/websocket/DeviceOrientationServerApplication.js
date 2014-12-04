/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DeviceOrientationServerApplication = dbm.importClass("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ConnectWebSocketRouter = dbm.importClass("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	var WebServer = dbm.importClass("dbm.nodejs.server.WebServer");
	var WebSocketServerConnection = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketServerConnection");
	var SharedPropertiesConnection = dbm.importClass("dbm.utils.websocket.binarycommand.SharedPropertiesConnection");
	var BufferEncodingData = dbm.importClass("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions");
	var BinaryCommandFlowSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var SharedPropertyDataTypes = dbm.importClass("dbm.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication::_init");
		
		this.superCall();
		
		this._webServer = null;
		this._connections = new Array();
		
		this._alpha = this.createProperty("alpha", 0);
		this._beta = this.createProperty("beta", 0);
		this._gamma = this.createProperty("gamma", 0);
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication::start");
		
		this._webServer = WebServer.create(8080);
		
		var inputApiPoint = ConnectWebSocketRouter.create("/dbm/examples/input");
		inputApiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createInputConnection, [GetVariableObject.createSelectDataCommand()]));
		this._webServer.addUpgradeRouter(inputApiPoint);
		
		var outputApiPoint = ConnectWebSocketRouter.create("/dbm/examples/output");
		outputApiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createOutputConnection, [GetVariableObject.createSelectDataCommand()]));
		this._webServer.addUpgradeRouter(outputApiPoint);
		
		this._webServer.start();
	};
	
	objectFunctions._createInputConnection = function(aApiCallData) {
		console.log("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication::_createInputConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var socketConnection = WebSocketServerConnection.create(nativeSocket, 13); //MEDEBUG: use protocol version instead
		var newConnection = SharedPropertiesConnection.create(socketConnection);
		newConnection.setEncodingDataClass(BufferEncodingData);
		BinaryCommandFlowSetup.setup(newConnection);
		
		var alphaProperty = newConnection.createSharedProperty("alpha", 0, 0, SharedPropertyDataTypes.FLOAT_32);
		var betaProperty = newConnection.createSharedProperty("beta", 1, 0, SharedPropertyDataTypes.FLOAT_32);
		var gammaProperty = newConnection.createSharedProperty("gamma", 2, 0, SharedPropertyDataTypes.FLOAT_32);
		
		this._alpha.connectInput(alphaProperty);
		this._beta.connectInput(betaProperty);
		this._gamma.connectInput(gammaProperty);
		
		this._connections.push(newConnection);
		
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.TIMEOUT, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._connectionClosed, [newConnection]));
		this._connections.push(newConnection);
		newConnection.startUpdatingTransfer();
	};
	
	objectFunctions._createOutputConnection = function(aApiCallData) {
		console.log("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication::_createOutputConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var socketConnection = WebSocketServerConnection.create(nativeSocket, 13); //MEDEBUG: use protocol version instead
		var newConnection = SharedPropertiesConnection.create(socketConnection);
		newConnection.setEncodingDataClass(BufferEncodingData);
		BinaryCommandFlowSetup.setup(newConnection);
		
		var alphaProperty = newConnection.createSharedProperty("alpha", 0, this._alpha, SharedPropertyDataTypes.FLOAT_32);
		var betaProperty = newConnection.createSharedProperty("beta", 1, this._beta, SharedPropertyDataTypes.FLOAT_32);
		var gammaProperty = newConnection.createSharedProperty("gamma", 2, this._gamma, SharedPropertyDataTypes.FLOAT_32);
		
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.TIMEOUT, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._connectionClosed, [newConnection]));
		this._connections.push(newConnection);
		newConnection.startUpdatingTransfer();
	};

	objectFunctions._connectionClosed = function(aConnection) {
		console.log("dbm.nodejs.projects.examples.websocket.DeviceOrientationServerApplication::_connectionClosed");
		
		var index = ArrayFunctions.indexOfInArray(this._connections, aConnection);
		if(index !== -1) {
			this._connections.splice(index, 1);
		}
		
		aConnection.destroy();
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