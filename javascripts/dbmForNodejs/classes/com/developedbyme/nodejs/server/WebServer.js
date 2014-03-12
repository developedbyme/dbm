dbm.registerClass("com.developedbyme.nodejs.server.WebServer", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.WebServer");
	//"use strict";
	
	var http = require("http");
	
	//Self reference
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var RouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.RouterGroup");
	var ErrorCheckingRouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup");
	var RoutedData = dbm.importClass("com.developedbyme.nodejs.server.router.RoutedData");
	var StaticResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.StaticResponseRouter");
	var ErrorResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter");
	var FileLoadResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.FileLoadResponseRouter");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var ServerEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.ServerEventIds");
	var ServerStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.ServerStatusTypes");
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.WebServer::_init");
		
		this.superCall();
		
		this._status = ServerStatusTypes.STOPPED;
		
		this._nativeServer = null;
		this._port = 80;
		
		this._requestRouterGroup = null;
		this._defaultRequestRouterGroup = null;
		
		this._upgradeRouterGroup = null;
		this._defaultUpgradeRouterGroup = null;
		
		this.getExtendedEvent().addCommandToEvent(ServerEventIds.LISTENING, CallFunctionCommand.createCommand(this, this._serverStarted, []));
		this.getExtendedEvent().addCommandToEvent(ServerEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._serverStopped, []));
		this.getExtendedEvent().addCommandToEvent(ServerEventIds.REQUEST, CallFunctionCommand.createCommand(this, this._handleRequest, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), GetVariableObject.createSelectMultipleArgumentDataCommand(1)]));
		this.getExtendedEvent().addCommandToEvent(ServerEventIds.UPGRADE, CallFunctionCommand.createCommand(this, this._handleUpgrade, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), GetVariableObject.createSelectMultipleArgumentDataCommand(1), GetVariableObject.createSelectMultipleArgumentDataCommand(2)]));
		
		return this;
	};
	
	objectFunctions.setupDefaultRouters = function(aRootDirectory) {
		this._requestRouterGroup = ErrorCheckingRouterGroup.create(ErrorResponseRouter.createStandardResponse());
		this._defaultRequestRouterGroup = RouterGroup.create();
		this._defaultRequestRouterGroup.setMaintainExclusiveness(true);
		
		var fileLoaderGroup = RouterGroup.create();
		fileLoaderGroup.addRouter(this._defaultRequestRouterGroup);
		if(aRootDirectory !== null) {
			fileLoaderGroup.addRouter(FileLoadResponseRouter.create(aRootDirectory));
		}
		
		this._requestRouterGroup.addRouter(fileLoaderGroup);
		this._requestRouterGroup.addRouter(StaticResponseRouter.create(404, {"Content-Type": "text/plain"}, "404 File not found"));
		
		this._upgradeRouterGroup = RouterGroup.create();
		this._defaultUpgradeRouterGroup = RouterGroup.create();
		this._upgradeRouterGroup.addRouter(this._defaultUpgradeRouterGroup);
		//METODO: add close socket
	};
	
	objectFunctions.setNativeServer = function(aNativeServer) {
		this._nativeServer = aNativeServer;
		
		//METODO:  add listener for close
		this.getExtendedEvent().linkJavascriptEvent(this._nativeServer, ServerEventIds.LISTENING, ServerEventIds.LISTENING, ServerEventIds.LISTENING, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeServer, ServerEventIds.REQUEST, ServerEventIds.REQUEST, ServerEventIds.REQUEST, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._nativeServer, ServerEventIds.UPGRADE, ServerEventIds.UPGRADE, ServerEventIds.REQUEST, true, false);
		
		return this;
	};
	
	objectFunctions.setPort = function(aPort) {
		this._port = aPort;
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.server.WebServer::start");
		
		this._status = ServerStatusTypes.STARTING;
		
		this.getExtendedEvent().activateJavascriptEventLink(ServerEventIds.LISTENING);
		this.getExtendedEvent().activateJavascriptEventLink(ServerEventIds.REQUEST);
		
		this._nativeServer.listen(this._port);
	};
	
	objectFunctions.addRequestRouter = function(aRouter) {
		this._defaultRequestRouterGroup.addRouter(aRouter);
		
		return this;
	};
	
	objectFunctions.addUpgradeRouter = function(aRouter) {
		this._defaultUpgradeRouterGroup.addRouter(aRouter);
		
		return this;
	};
	
	objectFunctions._serverStarted = function() {
		console.log("com.developedbyme.nodejs.server.WebServer::_serverStarted");
		
		this._status = ServerStatusTypes.RUNNING;
	};
	
	objectFunctions._serverStopped = function() {
		console.log("com.developedbyme.nodejs.server.WebServer::_serverStopped");
		
		this._status = ServerStatusTypes.STOPPED;
	};
	
	objectFunctions._handleRequest = function(aRequest, aResponse) {
		console.log("com.developedbyme.nodejs.server.WebServer::_handleRequest");
		
		//METODO: handle redirects
		
		var routedData = RoutedData.create(RoutedDataTypes.REQUEST, aRequest);
		routedData.response = aResponse;
		this._requestRouterGroup.route(routedData);
	};
	
	objectFunctions._handleUpgrade = function(aRequest, aSocket, aHead) {
		console.log("com.developedbyme.nodejs.server.WebServer::_handleUpgrade");
		var routedData = RoutedData.create(RoutedDataTypes.UPGRADE, aRequest);
		routedData.socket = aSocket;
		routedData.headData = aHead;
		this._upgradeRouterGroup.route(routedData);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeServer = null;
		
		this.superCall();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ServerEventIds.LISTENING:
			case ServerEventIds.CLOSE:
			case ServerEventIds.REQUEST:
			case ServerEventIds.UPGRADE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aPort) {
		//console.log("com.developedbyme.nodejs.server.WebServer::create");
		//console.log(aPort);
		
		var newWebServer = (new ClassReference()).init();
		
		newWebServer.setNativeServer(http.createServer());
		newWebServer.setPort(aPort);
		newWebServer.setupDefaultRouters(null);
		
		return newWebServer;
	};
	
	staticFunctions.createHttpServer = function(aPort, aRootDirectory) {
		var newWebServer = (new ClassReference()).init();
		
		newWebServer.setNativeServer(http.createServer());
		newWebServer.setPort(aPort);
		newWebServer.setupDefaultRouters(aRootDirectory);
		
		return newWebServer;
	};
});