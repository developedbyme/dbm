/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.development.CommandLineWithVisualResultApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var CommandLineWithVisualResultApplication = dbm.importClass("com.developedbyme.projects.examples.development.CommandLineWithVisualResultApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("com.developedbyme.utils.development.CommandLineExecutor");
	
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
		//console.log("com.developedbyme.projects.examples.development.CommandLineWithVisualResultApplication::_init");
		
		this.superCall();
		
		this._executor = null;
		this._codeMirrorView = null;
		
		this._layoutTemplatePath = "../assets/examples/development/commandLineTemplates.html#codeOnLeft";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._layoutTemplatePath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.development.CommandLineWithVisualResultApplication::_createPage");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._layoutTemplatePath, {}, true, this._contentHolder, true);
		console.log(templateResult);
		
		var executeKeyMap = "Shift-Enter";
		var executeCommand = CallFunctionCommand.createCommand(this, this._executeCurrentScript, []);
		
		this._executor = CommandLineExecutor.create();
		this._codeMirrorView = templateResult.getController("code");
		this._codeMirrorView.addKeyMap(executeKeyMap, executeCommand);
		
		var holder = templateResult.getController("visual");
		this._executor.addClosureVariable("holder", holder);
		
		var initialScript = "";
		initialScript += "var DisplayBaseObject = dbm.importClass(\"com.developedbyme.gui.DisplayBaseObject\");" + "\n";
		initialScript += "var InterpolationTypes = dbm.importClass(\"com.developedbyme.constants.InterpolationTypes\");" + "\n";
		initialScript += "\n";
		initialScript += "var testObject = DisplayBaseObject.createDiv(holder.getElement(), true, {\"style\": \"position: absolute; width: 50px; height: 50px; background-color: #FF0000;\"});" + "\n";
		initialScript += "testObject.setElementAsPositioned();" + "\n";
		initialScript += "testObject.getProperty(\"display\").startUpdating();" + "\n";
		initialScript += "testObject.getProperty(\"x\").setValue(10);" + "\n";
		initialScript += "testObject.getProperty(\"y\").setValue(10);" + "\n";
		initialScript += "testObject.getProperty(\"x\").animateValue(150, 0.5, InterpolationTypes.LINEAR, 0.5);" + "\n";
		initialScript += "testObject.getProperty(\"y\").animateValue(150, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0.5);" + "\n";
		
		this._codeMirrorView.setValue(initialScript);
		this._codeMirrorView.activate();
	};
	
	objectFunctions._executeCurrentScript = function() {
		console.log("com.developedbyme.projects.examples.development.CommandLineWithVisualResultApplication::_executeCurrentScript");
		var currentScript = this._codeMirrorView.getValue();
		console.log(currentScript);
		this._executor.executeScript(currentScript);
		this._codeMirrorView.setValue("");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._executor = null;
		this._codeMirrorView = null;
		
		this.superCall();
	};
});