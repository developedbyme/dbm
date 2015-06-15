/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Self reference
	var BinaryCommandFlowSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var SharedPropertyEncoder = dbm.importClass("dbm.utils.websocket.binarycommand.SharedPropertyEncoder");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var SharedPropertyDataTypesSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.SharedPropertyDataTypesSetup");
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("dbm.constants.websocket.BinaryCommandPaths");
	
	staticFunctions.setup = function(aCommandConnection) {
		ClassReference.setupTransfer(aCommandConnection);
	};
	
	staticFunctions.setupTransfer = function(aCommandConnection) {
		
		var updatePathId = [1, 0, 2];
		
		var updatePropertyEncoder = SharedPropertyEncoder.create();
		updatePropertyEncoder.setMessagePrefix(aCommandConnection.encodeIdPath(updatePathId));
		SharedPropertyDataTypesSetup.setup(updatePropertyEncoder);
		aCommandConnection.addEncoder(BinaryCommandPaths.FLOW_UPDATE_PROPERTY, updatePathId, updatePropertyEncoder);
		
		updatePropertyEncoder.decodedEventPerformer.addCommand(CallFunctionCommand.createCommand(aCommandConnection, aCommandConnection.updatePropertyFromConnection, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), GetVariableObject.createSelectMultipleArgumentDataCommand(1)]));
		
	};
});