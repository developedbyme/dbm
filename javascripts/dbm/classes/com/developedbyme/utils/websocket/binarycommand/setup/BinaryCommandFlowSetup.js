dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Self reference
	var BinaryCommandFlowSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var SharedPropertyEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertyEncoder");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var SharedPropertyDataTypesSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.SharedPropertyDataTypesSetup");
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("com.developedbyme.constants.websocket.BinaryCommandPaths");
	
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