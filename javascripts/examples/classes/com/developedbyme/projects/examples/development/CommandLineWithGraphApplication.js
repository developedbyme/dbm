/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.development.CommandLineWithGraphApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var CommandLineWithGraphApplication = dbm.importClass("com.developedbyme.projects.examples.development.CommandLineWithGraphApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("com.developedbyme.utils.development.CommandLineExecutor");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var PlaybackNode = dbm.importClass("com.developedbyme.flow.nodes.time.PlaybackNode");
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	var CreateCurveFromTimelineNode = dbm.importClass("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	
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
		//console.log("com.developedbyme.projects.examples.development.CommandLineWithGraphApplication::_init");
		
		this.superCall();
		
		this._executor = null;
		this._codeMirrorView = null;
		
		this._layoutTemplatePath = "../assets/examples/development/commandLineTemplates.html#codeOnLeft";
		this._graphLayoutTemplatePath = "../assets/examples/development/commandLineTemplates.html#bottomGraph";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._layoutTemplatePath, this._graphLayoutTemplatePath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.development.CommandLineWithGraphApplication::_createPage");
		
		var playbackNode = PlaybackNode.createWithGlobalInput();
		playbackNode.setupPlayback(0, 10, true);
		playbackNode.play();
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._graphLayoutTemplatePath, {}, true, this._contentHolder, true);
		
		var graphSlider = templateResult.getController("graph");
		graphSlider.connectPlaybackNode(playbackNode);
		
		
		var canvasView = templateResult.getController("graph/canvas");
		CanvasView.set2dControllerToView(canvasView); //METODO: move this to template
		var canvasController = canvasView.getController();
		
		this._contentHolder = templateResult.getController("visual").getElement();
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._layoutTemplatePath, {}, true, this._contentHolder, true);
		
		var executeKeyMap = "Shift-Enter";
		var executeCommand = CallFunctionCommand.createCommand(this, this._executeCurrentScript, []);
		
		this._executor = CommandLineExecutor.create();
		this._codeMirrorView = templateResult.getController("code");
		this._codeMirrorView.addKeyMap(executeKeyMap, executeCommand);
		
		var holder = templateResult.getController("visual");
		this._executor.addClosureVariable("holder", holder);
		
		var animatedObject = DisplayBaseObject.createDiv(holder.getElement(), true, {"style": "position: absolute; width: 50px; height: 50px; background-color: #FF0000;"});
		animatedObject.setElementAsPositioned();
		animatedObject.getProperty("display").startUpdating();
		animatedObject.getProperty("x").setValue(10);
		animatedObject.getProperty("y").setValue(10);
		this._executor.addClosureVariable("animatedObject", animatedObject);
		
		var xAnimationController = dbm.singletons.dbmAnimationManager.createTimeline(10);
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(xAnimationController, playbackNode.getProperty("outputTime"), animatedObject.getProperty("x"));
		var yAnimationController = dbm.singletons.dbmAnimationManager.createTimeline(10);
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(yAnimationController, playbackNode.getProperty("outputTime"), animatedObject.getProperty("y"));
		
		var maxTimeProperty = playbackNode.getProperty("maxTime");
		var canvasWidthProperty = canvasView.getProperty("canvasWidth");
		var curveCreatorXNode = CreateCurveFromTimelineNode.create(xAnimationController, 0, maxTimeProperty, canvasWidthProperty, 0);
		var curveCreatorYNode = CreateCurveFromTimelineNode.create(yAnimationController, 0, maxTimeProperty, canvasWidthProperty, 0);
		
		var scaleXNode = DivisionNode.create(canvasWidthProperty, maxTimeProperty);
		
		var centerLayer = canvasController.getLayer("/center");
		centerLayer.getProperty("y").setValue(50);
		centerLayer.getProperty("scaleX").connectInput(scaleXNode.getProperty("outputValue"));
		centerLayer.getProperty("scaleY").setValue(0.1);
		
		var xMaxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorXNode.getProperty("outputCurve"));
		var drawLayerX = canvasController.getLayer("/center/lineX");
		drawLayerX.setStrokeStyle(0, "#00FF00");
		var curveDrawerX = drawLayerX.drawCurve(curveCreatorXNode.getProperty("outputCurve").getValue());
		curveDrawerX.getProperty("curve").connectInput(curveCreatorXNode.getProperty("outputCurve"));
		curveDrawerX.getProperty("endParameter").connectInput(xMaxParameterNode.getProperty("outputParameter"));
		
		var yMaxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorYNode.getProperty("outputCurve"));
		var drawLayerY = canvasController.getLayer("/center/lineY");
		drawLayerY.setStrokeStyle(0, "#0000FF");
		var curveDrawerY = drawLayerY.drawCurve(curveCreatorYNode.getProperty("outputCurve").getValue());
		curveDrawerY.getProperty("curve").connectInput(curveCreatorYNode.getProperty("outputCurve"));
		curveDrawerY.getProperty("endParameter").connectInput(yMaxParameterNode.getProperty("outputParameter"));
		
		canvasController.getProperty("display").startUpdating();
		
		var initialScript = "";
		initialScript += "var InterpolationTypes = dbm.importClass(\"com.developedbyme.constants.InterpolationTypes\");" + "\n";
		initialScript += "\n";
		initialScript += "animatedObject.getProperty(\"x\").animateValue(150, 0.5, InterpolationTypes.LINEAR, 0.5);" + "\n";
		initialScript += "animatedObject.getProperty(\"y\").animateValue(200, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0.5);" + "\n";
		initialScript += "\n";
		initialScript += "animatedObject.getProperty(\"x\").animateValue(20, 0.9, InterpolationTypes.QUADRATIC, 2);" + "\n";
		initialScript += "animatedObject.getProperty(\"y\").animateValue(450, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 2); " + "\n";
		
		this._codeMirrorView.setValue(initialScript);
		this._codeMirrorView.activate();
	};
	
	objectFunctions._executeCurrentScript = function() {
		console.log("com.developedbyme.projects.examples.development.CommandLineWithGraphApplication::_executeCurrentScript");
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