dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	//Self reference
	var DefaultTemplateCommandsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyInputCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand");
	var UpdatePropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand");
	var StartUpdatingPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.StartUpdatingPropertyCommand");
	var SetVariableCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetVariableCommand");
	
	var WorkspaceCommandFunctions = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	var SwitchableAreaCommandFunctions = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluateArrayWithTypesObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	var SplitStringObject = dbm.importClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject");
	var CombineArraysObject = dbm.importClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.CombineArraysObject");
	var NotNullObject = dbm.importClass("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var TemplateCommandNames = dbm.importClass("com.developedbyme.constants.TemplateCommandNames");
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.setup = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup::setup");
		
		var selectDataCommand = GetVariableObject.createSelectDataCommand();
		var selectArgumentReevaluator = GetVariableObject.createCommand(selectDataCommand, "arguments");
		var selectDynamicDataReevaluator = GetVariableObject.createCommand(selectDataCommand, "dynamicData");
		var splitArgumentsReevaluator = SplitStringObject.createCommand(selectArgumentReevaluator, " ");
		
		ClassReference._createCallFunction(TemplateCommandNames.POSITIONED, "setElementAsPositioned", []);
		ClassReference._createCallFunction(TemplateCommandNames.SIZED, "setElementAsSized", []);
		ClassReference._createCallFunction(TemplateCommandNames.TRANSFORMED, "setElementAsTransformed", []);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.UPDATE_DISPLAY, StartUpdatingPropertyCommand.createStartUpdatingPropertyOnPerformingObjectCommand("display", true));
		
		ClassReference._createCallFunction(TemplateCommandNames.ALPHA_ENABLED, "enableAlpha", []);
		ClassReference._createCallFunction(TemplateCommandNames.Z_INDEX_ENABLED, "enableZIndex", []);
		
		//Dynamic data
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.ADD_DYNAMIC_OBJECT, SetVariableCommand.createCommand(
				selectDynamicDataReevaluator,
				this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument is null in " + TemplateCommandNames.ADD_DYNAMIC_OBJECT + "."),
				GetVariableObject.createSelectPerformingObjectCommand()
			)
		);
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.ADD_DYNAMIC_PROPERTY, SetVariableCommand.createCommand(
				selectDynamicDataReevaluator,
				this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 1, "Second argument is null in " + TemplateCommandNames.ADD_DYNAMIC_PROPERTY + "."),
				GetPropertyObject.createCommand(
					GetVariableObject.createSelectPerformingObjectCommand(),
					this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument is null in " + TemplateCommandNames.ADD_DYNAMIC_PROPERTY + ".")
				)
			)
		);
		
		//Flow
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.CONNECT_INPUT, SetPropertyInputCommand.createCommand(
				GetPropertyObject.createCommand(
					GetVariableObject.createSelectPerformingObjectCommand(),
					this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument is null in " + TemplateCommandNames.CONNECT_INPUT + ".")
				),
				this._createVerifiedSelectDataFunction(
					selectDynamicDataReevaluator,
					this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 1, "Second argument is null in " + TemplateCommandNames.CONNECT_INPUT + "."),
					"No dynamic input specified"
				)
			)
		);
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.CONNECT_OUTPUT, SetPropertyInputCommand.createCommand(
				this._createVerifiedSelectDataFunction(
					selectDynamicDataReevaluator,
					this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 1, "Second argument is null in " + TemplateCommandNames.CONNECT_OUTPUT + "."),
					"No dynamic output specified"
				),
				GetPropertyObject.createCommand(
					GetVariableObject.createSelectPerformingObjectCommand(),
					this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument is null in " + TemplateCommandNames.CONNECT_OUTPUT + ".")
				)
			)
		);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.UPDATE_FLOW, StartUpdatingPropertyCommand.createStartUpdatingPropertyOnPerformingObjectCommand(ClassReference._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument doesn't exist for " + TemplateCommandNames.UPDATE_FLOW + ".")));
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.START_UPDATING_FLOW, StartUpdatingPropertyCommand.createStartUpdatingPropertyOnPerformingObjectCommand(ClassReference._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument doesn't exist for " + TemplateCommandNames.START_UPDATING_FLOW + "."), true));
		
		//Workspace
		ClassReference._createCallFunction(TemplateCommandNames.ELEMENT_SIZE_AS_AREA, "linkElementSizeToWorkspaceArea", []);
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.LAYOUT_SPLIT, CallFunctionCommand.createCommand(
				WorkspaceCommandFunctions, WorkspaceCommandFunctions.createLayoutSplit, ReevaluateArrayWithTypesObject.createCommand(
					CombineArraysObject.createCommand([GetVariableObject.createSelectPerformingObjectCommand()], splitArgumentsReevaluator),
					[JavascriptObjectTypes.NON_REAL_TYPE_ANY, JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_NUMBER, JavascriptObjectTypes.TYPE_NUMBER, JavascriptObjectTypes.TYPE_STRING]
				)
			)
		);
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.SIZED_ELEMENT_AREA, CallFunctionCommand.createCommand(WorkspaceCommandFunctions, WorkspaceCommandFunctions.createSizedElementArea, [GetVariableObject.createSelectPerformingObjectCommand(), selectArgumentReevaluator]));
		
		//State
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.ADD_STATE_IMAGE, CallFunctionCommand.createCallFunctionOnPerformingObjectCommand(
				"addStateFromAsset", ReevaluateArrayWithTypesObject.createCommand(
					splitArgumentsReevaluator,
					[JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_BOOLEAN]
				)
			)
		);
		
		//Switchable
		//METODO
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.CREATE_IN_DOM_SWITCHABLE_AREA, CallFunctionCommand.createCommand(
				SwitchableAreaCommandFunctions, SwitchableAreaCommandFunctions.createInDomSwitchableArea, [GetVariableObject.createSelectPerformingObjectCommand()]
			)
		);
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.ADD_SWITCHABLE_AREA, CallFunctionCommand.createCommand(
				SwitchableAreaCommandFunctions, SwitchableAreaCommandFunctions.addArea, ReevaluateArrayWithTypesObject.createCommand(
					CombineArraysObject.createCommand([GetVariableObject.createSelectPerformingObjectCommand()], splitArgumentsReevaluator),
					[JavascriptObjectTypes.NON_REAL_TYPE_ANY, JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_BOOLEAN]
				)
			)
		);
		
	};
	
	staticFunctions._createCallFunction = function(aCommandName, aFunctionName, aArgumentsArray) {
		dbm.singletons.dbmTemplateManager.addCommand(aCommandName, CallFunctionCommand.createCallFunctionOnPerformingObjectCommand(aFunctionName, []));
		
	};
	
	staticFunctions._createVerifiedSelectDataFunction = function(aObject, aDataName, aErrorMessage) {
		if(!VariableAliases.isSet(aErrorMessage)) {
			aErrorMessage = "Variable " + aDataName + " doesn't exist.";
		}
		
		return NotNullObject.createCommand(GetVariableObject.createCommand(aObject, aDataName), aErrorMessage);
	};
});