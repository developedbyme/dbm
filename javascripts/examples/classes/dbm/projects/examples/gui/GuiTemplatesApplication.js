/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.gui.GuiTemplatesApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var GuiTemplatesApplication = dbm.importClass("dbm.projects.examples.gui.GuiTemplatesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var MultipleControllersSwitch = dbm.importClass("dbm.flow.MultipleControllersSwitch");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var PlaybackExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.PlaybackExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.gui.GuiTemplatesApplication::_init");
		
		this.superCall();
		
		this._exampleBoxTemplatePath = "../assets/templates/dbm/visualTemplates.html#exampleBoxWithLabel";
		this._sliderWithInputFieldTemplatePath = "../assets/templates/dbm/visualTemplates.html#sliderWithInputField";
		this._textWithLabelTemplatePath = "../assets/templates/dbm/visualTemplates.html#textWithLabel";
		this._textWithLabelMultipleLinesTemplatePath = "../assets/templates/dbm/visualTemplates.html#textWithLabelMultipleLines";
		this._fileUploadButtonTemplatePath = "../assets/templates/dbm/visualTemplates.html#fileUploadButton";
		this._splitLayoutTemplatePath = "../assets/templates/dbm/visualTemplates.html#splitLayout";
		this._simplePlaybackControllerPath = "../assets/templates/dbm/visualTemplates.html#simplePlaybackController";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._addLayoutTemplate("../assets/templates/dbm/visualTemplates.html#centeredContent");
		
		this._assetsLoader.addAssetsByPath(this._exampleBoxTemplatePath, this._sliderWithInputFieldTemplatePath, this._textWithLabelTemplatePath, this._textWithLabelMultipleLinesTemplatePath, this._fileUploadButtonTemplatePath, this._splitLayoutTemplatePath, this._simplePlaybackControllerPath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.gui.GuiTemplatesApplication::_createPage");
		
		//sliderWithInputField
		var valueProperty = this.createProperty("value", 0.5);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._sliderWithInputFieldTemplatePath, {"value": valueProperty, "minValue": 0, "maxValue": 1}, true, this._createBox("Slider with input field"), true);
		
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
		
		//textWithLabel
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._textWithLabelTemplatePath, {"text": "The text", "label": "The label"}, true, this._createBox("Text with label"), true);
		
		//textWithLabelMultipleLines
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._textWithLabelMultipleLinesTemplatePath, {"text": "The text on multiple lines", "label": "The label on multiple lines"}, true, this._createBox("Text with label (on multiple lines)"), true);
		
		//File upload button
		var holder = this._createBox("Upload file button");
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._fileUploadButtonTemplatePath, {"typeLabel": "Type:", "noFileSelectedText": "Select file"}, true, holder, true);
		var fileUploadButton = templateResult.mainController;
		fileUploadButton.addAutoLoadCommand();
		fileUploadButton.activate();
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._textWithLabelMultipleLinesTemplatePath, {"text": fileUploadButton.getProperty("fileContents"), "label": "File contents"}, true, holder, true);
		
		//splitLayout
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._splitLayoutTemplatePath, null, true, this._createBox("Split layout"), true);
		
		
		//simplePlaybackContoller
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._simplePlaybackControllerPath, null, true, this._createBox("Simple playback controller"), true);
		
	};
	
	objectFunctions._createBox = function(aName) {
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._exampleBoxTemplatePath, {"label": aName}, true, this._contentHolder, true);
		
		templateResult.rootElement.classList.add("spacedItem");
		templateResult.rootElement.classList.add("v20");
		
		return templateResult.rootElement.querySelectorAll("*[name=contentHolder]")[0];
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});