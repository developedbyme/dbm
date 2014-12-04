/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Self reference
	var BinaryCommandDebugSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var StringEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.dataencoders.StringEncoder");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("dbm.constants.websocket.BinaryCommandPaths");
	
	staticFunctions.setup = function(aCommandConnection) {
		ClassReference.setupEcho(aCommandConnection);
	};
	
	staticFunctions.setupEcho = function(aCommandConnection) {
		var echoEncoder = aCommandConnection.createEncoder(BinaryCommandPaths.DEBUG_ECHO, [0, 0, 1]);
		echoEncoder.addDataEncoder(StringEncoder.create());
		echoEncoder.decodedEventPerformer.addCommand(CallFunctionCommand.createCommand(aCommandConnection, aCommandConnection.encodeAndSend, [BinaryCommandPaths.DEBUG_ECHO_REPLY, GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		
		var echoReplyEncoder = aCommandConnection.createEncoder(BinaryCommandPaths.DEBUG_ECHO_REPLY, [0, 0, 2]);
		echoReplyEncoder.addDataEncoder(StringEncoder.create());
		echoReplyEncoder.decodedEventPerformer.addCommand(LogCommand.createCommand("Echo reply", GetVariableObject.createSelectDataCommand()));
		
	};
});