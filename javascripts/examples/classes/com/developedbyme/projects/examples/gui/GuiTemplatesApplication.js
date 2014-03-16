/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.gui.GuiTemplatesApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var GuiTemplatesApplication = dbm.importClass("com.developedbyme.projects.examples.gui.GuiTemplatesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var MultipleControllersSwitch = dbm.importClass("com.developedbyme.flow.MultipleControllersSwitch");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.gui.GuiTemplatesApplication::_init");
		
		this.superCall();
		
		this._mainTemplatePath = "../assets/templates/dbm/visualTemplates.html#sliderWithInputField";
		
		this._assetsLoader.addAssetsByPath(this._mainTemplatePath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.gui.GuiTemplatesApplication::_createPage");
		
		var valueProperty = this.createProperty("value", 0.5);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplatePath, {"value": valueProperty, "minValue": 0, "maxValue": 1}, true, dbm.getDocument().body, true);
		
		var slider = templateResult.getController("slider");
		slider.enablePlayback();
		var inputField = templateResult.getController("inputField");
		
		var multipleControllerSwitch = MultipleControllersSwitch.create(valueProperty);
		multipleControllerSwitch.addController(slider.getProperty("playbackValue"), slider.getProperty("outputValue"));
		multipleControllerSwitch.addController(inputField.getProperty("value"));
		//multipleControllerSwitch.selectController(inputField.getProperty("value"));
		
		slider.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.START_SCRUBBING, CallFunctionCommand.createCommand(multipleControllerSwitch, multipleControllerSwitch.selectController, [slider.getProperty("playbackValue")]));
		slider.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.STOP_SCRUBBING, CallFunctionCommand.createCommand(multipleControllerSwitch, multipleControllerSwitch.deselectController, [slider.getProperty("playbackValue")]));
		
		inputField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.FOCUS, CallFunctionCommand.createCommand(multipleControllerSwitch, multipleControllerSwitch.selectController, [inputField.getProperty("value")]));
		inputField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.BLUR, CallFunctionCommand.createCommand(multipleControllerSwitch, multipleControllerSwitch.deselectController, [inputField.getProperty("value")]));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});