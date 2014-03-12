dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Self reference
	var BinaryCommandDebugSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var StringEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.StringEncoder");
	
	//Utils
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("com.developedbyme.constants.websocket.BinaryCommandPaths");
	
	staticFunctions.setup = function(aCommandConnection) {
		ClassReference.setupEcho(aCommandConnection);
	};
	
	staticFunctions.setupEcho = function(aCommandConnection) {
		var echoEncoder = aCommandConnection.createEncoder(BinaryCommandPaths.DEBUG_ECHO, [0, 0, 1]);
		echoEncoder.addDataEncoder(StringEncoder.create());
		//METODO: set up callback
		
		var echoReplyEncoder = aCommandConnection.createEncoder(BinaryCommandPaths.DEBUG_ECHO_REPLY, [0, 0, 2]);
		echoReplyEncoder.addDataEncoder(StringEncoder.create());
		//METODO: set up log function
		
	};
});