/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	//Self reference
	var DefaultTemplateCommandsSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyInputCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyInputCommand");
	var UpdatePropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand");
	var StartUpdatingPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand");
	var SetVariableCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetVariableCommand");
	
	var WorkspaceCommandFunctions = dbm.importClass("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	var SwitchableAreaCommandFunctions = dbm.importClass("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluateArrayWithTypesObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	var SplitStringObject = dbm.importClass("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject");
	var CombineArraysObject = dbm.importClass("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject");
	var NotNullObject = dbm.importClass("dbm.utils.reevaluation.verificationreevaluation.NotNullObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	//Constants
	var TemplateCommandNames = dbm.importClass("dbm.constants.TemplateCommandNames");
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	
	staticFunctions.setup = function() {
		//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup::setup");
		
		var selectDataCommand = GetVariableObject.createSelectDataCommand();
		var selectArgumentReevaluator = GetVariableObject.createCommand(selectDataCommand, "arguments");
		var selectDynamicDataReevaluator = GetVariableObject.createCommand(selectDataCommand, "dynamicData");
		var splitArgumentsReevaluator = SplitStringObject.createCommand(selectArgumentReevaluator, " ");
		
		var selectFirstChildReevaluator = CallFunctionObject.createCommand(
			XmlChildRetreiver,
			XmlChildRetreiver.getFirstChild,
			[
				CallFunctionObject.createCommand(
					GetVariableObject.createSelectPerformingObjectCommand(),
					GetVariableObject.createCommand(
						GetVariableObject.createSelectPerformingObjectCommand(),
						"getElement"
					),
					[]
				)
			]
		);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.IGNORE, LogCommand.createCommand("Ignoring command", selectArgumentReevaluator)); //METODO: add infor about what has been ignored
		
		ClassReference._createCallFunction(TemplateCommandNames.POSITIONED, "setElementAsPositioned", []);
		ClassReference._createCallFunction(TemplateCommandNames.SIZED, "setElementAsSized", []);
		ClassReference._createCallFunction(TemplateCommandNames.TRANSFORMED, "setElementAsTransformed", []);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.UPDATE_DISPLAY, StartUpdatingPropertyCommand.createStartUpdatingPropertyOnPerformingObjectCommand("display", true));
		
		ClassReference._createCallFunction(TemplateCommandNames.ALPHA_ENABLED, "enableAlpha", []);
		ClassReference._createCallFunction(TemplateCommandNames.Z_INDEX_ENABLED, "enableZIndex", []);
		ClassReference._createCallFunction(TemplateCommandNames.ACTIVATE, "activate", []);
		
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.CALL_FUNCTION, 
			CallFunctionCommand.createCallFunctionOnPerformingObjectCommand(
				this._createVerifiedSelectDataFunction(
					splitArgumentsReevaluator,
					0,
					"First argument is null in " + TemplateCommandNames.CALL_FUNCTION + "."
				),
				[]
			)
		);
		
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
		
		//Layout
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.LAYOUT_SPLIT, CallFunctionCommand.createCommand(
				WorkspaceCommandFunctions, WorkspaceCommandFunctions.createLayoutSplit, ReevaluateArrayWithTypesObject.createCommand(
					CombineArraysObject.createCommand([GetVariableObject.createSelectPerformingObjectCommand()], splitArgumentsReevaluator),
					[JavascriptObjectTypes.NON_REAL_TYPE_ANY, JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_NUMBER, JavascriptObjectTypes.TYPE_NUMBER, JavascriptObjectTypes.TYPE_STRING]
				)
			)
		);
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.SIZED_ELEMENT_AREA, CallFunctionCommand.createCommand(WorkspaceCommandFunctions, WorkspaceCommandFunctions.createSizedElementArea, [GetVariableObject.createSelectPerformingObjectCommand(), selectArgumentReevaluator]));
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.ADD_LAYOUT_CONTROLLER, CallFunctionCommand.createCommand(WorkspaceCommandFunctions, WorkspaceCommandFunctions.addLayoutController, [GetVariableObject.createSelectPerformingObjectCommand()]));
		dbm.singletons.dbmTemplateManager.addCommand(TemplateCommandNames.INPUT_AREA_FROM_ELEMENT_SIZE, CallFunctionCommand.createCommand(WorkspaceCommandFunctions, WorkspaceCommandFunctions.setSizeAsInputArea, [GetVariableObject.createSelectPerformingObjectCommand()]));
		
		//Slider
		ClassReference._createCallFunction(TemplateCommandNames.SCALE_FIRST_CHILD, "setScalingElement", [selectFirstChildReevaluator]);
		ClassReference._createCallFunction(TemplateCommandNames.SET_FIRST_CHILD_AS_PLAYHEAD, "setPlayheadElement", [selectFirstChildReevaluator]);
		
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
		
		dbm.singletons.dbmTemplateManager.addCommand(
			TemplateCommandNames.SWITCHABLE_VISIBLE_AREA_FROM_BOOLEAN_PROPERTY, CallFunctionCommand.createCommand(
				SwitchableAreaCommandFunctions, SwitchableAreaCommandFunctions.visibleAreaFromBooleanProperty, ReevaluateArrayWithTypesObject.createCommand(
					[
						GetVariableObject.createSelectPerformingObjectCommand(),
						this._createVerifiedSelectDataFunction(
							selectDynamicDataReevaluator,
							this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 0, "First argument is null in " + TemplateCommandNames.SWITCHABLE_VISIBLE_AREA_FROM_BOOLEAN_PROPERTY + "."),
							"No dynamic property specified"
						),
						this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 1, "Second argument is null in " + TemplateCommandNames.SWITCHABLE_VISIBLE_AREA_FROM_BOOLEAN_PROPERTY + "."),
						this._createVerifiedSelectDataFunction(splitArgumentsReevaluator, 2, "Third argument is null in " + TemplateCommandNames.SWITCHABLE_VISIBLE_AREA_FROM_BOOLEAN_PROPERTY + ".")
					],
					[JavascriptObjectTypes.NON_REAL_TYPE_ANY, JavascriptObjectTypes.NON_REAL_TYPE_ANY, JavascriptObjectTypes.TYPE_STRING, JavascriptObjectTypes.TYPE_STRING]
				)
			)
		);
	};
	
	staticFunctions._createCallFunction = function(aCommandName, aFunctionName, aArgumentsArray) {
		dbm.singletons.dbmTemplateManager.addCommand(aCommandName, CallFunctionCommand.createCallFunctionOnPerformingObjectCommand(aFunctionName, aArgumentsArray));
		
	};
	
	staticFunctions._createVerifiedSelectDataFunction = function(aObject, aDataName, aErrorMessage) {
		if(!VariableAliases.isSet(aErrorMessage)) {
			aErrorMessage = "Variable " + aDataName + " doesn't exist.";
		}
		
		return NotNullObject.createCommand(GetVariableObject.createCommand(aObject, aDataName), aErrorMessage);
	};
});