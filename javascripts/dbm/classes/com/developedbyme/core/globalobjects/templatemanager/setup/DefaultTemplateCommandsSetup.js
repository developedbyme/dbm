dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	var DefaultTemplateCommandsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var StartUpdatingPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.StartUpdatingPropertyCommand");
	
	var WorkspaceCommandFunctions = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var TemplateCommandNames = dbm.importClass("com.developedbyme.constants.TemplateCommandNames");
	
	staticFunctions.setup = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup::setup");
		
		var selectArgumentReevaluator = GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "arguments");
		
		ClassReference._createCallFunction(TemplateCommandNames.POSITIONED, "setElementAsPositioned", []);
		ClassReference._createCallFunction(TemplateCommandNames.SIZED, "setElementAsSized", []);
		ClassReference._createCallFunction(TemplateCommandNames.TRANSFORMED, "setElementAsTransformed", []);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.UPDATE_DISPLAY, StartUpdatingPropertyCommand.createStartUpdatingPropertyOnPerformingObjectCommand("display", true));
		
		ClassReference._createCallFunction(TemplateCommandNames.ALPHA_ENABLED, "enableAlpha", []);
		ClassReference._createCallFunction(TemplateCommandNames.Z_INDEX_ENABLED, "enableZIndex", []);
		
		//Workspace
		ClassReference._createCallFunction(TemplateCommandNames.ELEMENT_SIZE_AS_AREA, "linkElementSizeToWorkspaceArea", []);
		//METODO: split layout
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.SIZED_ELEMENT_AREA, CallFunctionCommand.createCommand(WorkspaceCommandFunctions, WorkspaceCommandFunctions.createSizedElementArea, [GetVariableObject.createSelectPerformingObjectCommand(), selectArgumentReevaluator]));
	};
	
	staticFunctions._createCallFunction = function(aCommandName, aFunctionName, aArgumentsArray) {
		dbm.singletons.dbmTemplateManager.addCommand(aCommandName, CallFunctionCommand.createCallFunctionOnPerformingObjectCommand(aFunctionName, []));
		
	};
});