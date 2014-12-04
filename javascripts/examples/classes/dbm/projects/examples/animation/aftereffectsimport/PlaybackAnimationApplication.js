/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.animation.aftereffectsimport.PlaybackAnimationApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var PlaybackAnimationApplication = dbm.importClass("dbm.projects.examples.animation.aftereffectsimport.PlaybackAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var PlaybackNode = dbm.importClass("dbm.flow.nodes.time.PlaybackNode");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var CreateCurveFromTimelineNode = dbm.importClass("dbm.flow.nodes.development.CreateCurveFromTimelineNode");
	var DivisionNode = dbm.importClass("dbm.flow.nodes.math.DivisionNode");
	var GetMaxParameterOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var VideoView = dbm.importClass("dbm.gui.media.video.VideoView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.animation.aftereffectsimport.PlaybackAnimationApplication::_init");
		
		this.superCall();
		
		this._graphLayoutTemplatePath = "../assets/examples/development/commandLineTemplates.html#bottomGraph";
		this._dataAssetPath = "../assets/examples/animation/aftereffectsimport/playbackAnimation2.xml";
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._assetsLoader.addAssetsByPath(this._dataAssetPath, this._graphLayoutTemplatePath);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.animation.aftereffectsimport.PlaybackAnimationApplication::_createPage");
		
		var playbackNode = PlaybackNode.createWithGlobalInput();
		playbackNode.setupPlayback(0, 10, true);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._graphLayoutTemplatePath, {}, true, this._contentHolder, true);
		
		var graphSlider = templateResult.getController("graph");
		graphSlider.connectPlaybackNode(playbackNode);
		graphSlider.getProperty("minValue").connectInput(playbackNode.getProperty("minTime"));
		graphSlider.getProperty("maxValue").connectInput(playbackNode.getProperty("maxTime"));
		
		var canvasView = templateResult.getController("graph/canvas");
		CanvasView.set2dControllerToView(canvasView); //METODO: move this to template
		var canvasController = canvasView.getController();
		
		this._contentHolder = templateResult.getController("visual").getElement();
		
		var videoView = VideoView.create(this._contentHolder, true, ["../assets/examples/animation/aftereffectsimport/playbackAnimationReference2.mp4"], true, {"style": "position: absolute; left: 0px; top: 0px; width: 1920px; height: 1080px;"});
		videoView.setPlaybackNode(playbackNode);
		videoView.play();
		playbackNode.play();
		
		videoView.getProperty("display").startUpdating();
		
		var animationData = dbm.singletons.dbmAssetRepository.getAssetData(this._dataAssetPath);
		
		var dataName = "playbackData";
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(animationData), dataName);
		var exportData = dbm.singletons.dbmDataManager.getData(dataName);
		var parsedAnimationData = exportData.data[exportData.metaData.getObject("mainComposition")];
		var duration = parsedAnimationData.metaData.getObject("duration");
		
		playbackNode.getProperty("maxTime").setValue(parsedAnimationData.metaData.getObject("duration"));
		
		var currentLayerData = parsedAnimationData.data[0];
		var animatedObject = DisplayBaseObject.createDiv(this._contentHolder, true, {"style": "position: absolute; left: 0px; top: 0px; background-color: rgba(255, 0, 0, 0.5)"});
		animatedObject.setElementAsSized();
		animatedObject.setElementAsTransformed();
		animatedObject.enableAlpha();
		
		animatedObject.getProperty("width").setValue(currentLayerData.metaData.getObject("width"));
		animatedObject.getProperty("height").setValue(currentLayerData.metaData.getObject("height"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/position/x"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("x"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/position/y"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("y"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/scale/x"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("scaleX"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/scale/y"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("scaleY"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/rotation"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("rotate"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(currentLayerData.data.getObject("transform/opacity"), playbackNode.getProperty("outputTime"), animatedObject.getProperty("alpha"));
		
		animatedObject.getProperty("display").startUpdating();
		
		
		
		var maxTimeProperty = playbackNode.getProperty("maxTime");
		var canvasWidthProperty = canvasView.getProperty("canvasWidth");
		var curveCreatorRotationNode = CreateCurveFromTimelineNode.create(currentLayerData.data.getObject("transform/rotation"), 0, maxTimeProperty, canvasWidthProperty, 0);
		
		var scaleXNode = DivisionNode.create(canvasWidthProperty, maxTimeProperty);
		
		var centerLayer = canvasController.getLayer("/center");
		centerLayer.getProperty("y").setValue(90);
		centerLayer.getProperty("scaleX").connectInput(scaleXNode.getProperty("outputValue"));
		centerLayer.getProperty("scaleY").setValue(-1);
		
		var rotationMaxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorRotationNode.getProperty("outputCurve"));
		var drawLayerRotation = canvasController.getLayer("/center/lineRotation");
		drawLayerRotation.setStrokeStyle(0, "#00FF00");
		var curveDrawerRotation = drawLayerRotation.drawCurve(curveCreatorRotationNode.getProperty("outputCurve").getValue());
		curveDrawerRotation.getProperty("curve").connectInput(curveCreatorRotationNode.getProperty("outputCurve"));
		curveDrawerRotation.getProperty("endParameter").connectInput(rotationMaxParameterNode.getProperty("outputParameter"));
		
		canvasController.getProperty("display").startUpdating();
		
		console.log(parsedAnimationData);
		console.log(curveDrawerRotation);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});