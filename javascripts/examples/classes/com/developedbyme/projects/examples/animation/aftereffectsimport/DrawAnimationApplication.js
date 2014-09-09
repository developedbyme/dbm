/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawAnimationApplication = dbm.importClass("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var PlaybackNode = dbm.importClass("com.developedbyme.flow.nodes.time.PlaybackNode");
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var CreateCurveFromTimelineNode = dbm.importClass("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var VideoView = dbm.importClass("com.developedbyme.gui.media.video.VideoView");
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_init");
		
		this.superCall();
		
		this._graphLayoutTemplatePath = "../assets/examples/development/commandLineTemplates.html#bottomGraph";
		this._dataAssetPath = "../assets/examples/animation/aftereffectsimport/drawAnimation.xml";
		
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
		console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_createPage");
		
		var playbackNode = PlaybackNode.createWithGlobalInput();
		playbackNode.setupPlayback(0, 10, true);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._graphLayoutTemplatePath, {}, true, this._contentHolder, true);
		
		var graphSlider = templateResult.getController("graph");
		graphSlider.connectPlaybackNode(playbackNode);
		graphSlider.getProperty("minValue").connectInput(playbackNode.getProperty("minTime"));
		graphSlider.getProperty("maxValue").connectInput(playbackNode.getProperty("maxTime"));
		
		//var canvasView = templateResult.getController("graph/canvas");
		//CanvasView.set2dControllerToView(canvasView); //METODO: move this to template
		//var canvasController = canvasView.getController();
		
		this._contentHolder = templateResult.getController("visual").getElement();
		
		var animationData = dbm.singletons.dbmAssetRepository.getAssetData(this._dataAssetPath);
		
		var dataName = "playbackData";
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(animationData), dataName);
		var parsedAnimationData = dbm.singletons.dbmDataManager.getData(dataName).data;
		
		playbackNode.getProperty("maxTime").setValue(parsedAnimationData.metaData.getObject("duration"));
		playbackNode.play();
		
		var scale = 0.5;
		
		var width = parsedAnimationData.metaData.getObject("width");
		var height = parsedAnimationData.metaData.getObject("height");
		
		var mainCanvasView = CanvasView.create(this._contentHolder, true, "2d", {"width": Math.ceil(scale*width), "height": Math.ceil(scale*height)});
		var mainCanvasController = mainCanvasView.getController();
		
		
		var mainLayer = mainCanvasController.getLayer("main");
		mainLayer.getProperty("scaleX").setValue(scale);
		mainLayer.getProperty("scaleY").setValue(scale);
		
		var backgroundLayer = mainCanvasController.getLayer("main/background");
		backgroundLayer.setFillStyle(parsedAnimationData.metaData.getObject("backgroundColor").getCssString());
		backgroundLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, width, height));
		
		var currentArray = parsedAnimationData.data;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIndex = currentArrayLength-i-1;
			var currentLayerData = currentArray[currentIndex];
			console.log(currentLayerData);
			var layerName = "main/layer_" + currentIndex;
			var currentLayer = mainCanvasController.getLayer(layerName);
			this.setupLayer(currentLayer, currentLayerData, playbackNode);
		}
		
		mainCanvasController.getProperty("display").startUpdating();
		
		
		/*
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
		*/
	};
	
	objectFunctions.setupLayer = function(aLayer, aAnimationData, aPlaybackNode) {
		
		var graphicsLayer = aLayer.getChildByPath("graphics");
		
		var footageType = aAnimationData.metaData.getObject("footageType");
		if(footageType === "solid") {
			var color = aAnimationData.metaData.getObject("color");
			graphicsLayer.setFillStyle(color.getCssString());
		}
		else {
			console.log("Using default color");
			graphicsLayer.setFillStyle("rgba(0, 0, 0, 0.1)");
		}
		
		var layerWidth = aAnimationData.metaData.getObject("width");
		var layerHeight = aAnimationData.metaData.getObject("height");
		
		graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
		
		var timelines = aAnimationData.data;
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/position/x"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("x"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/position/y"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("y"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/scale/x"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("scaleX"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/scale/y"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("scaleY"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/rotation"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("rotate"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/opacity"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("alpha"));
		
		CanvasLayer2d.addPivotToLayer(aLayer);
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/anchorPoint/x"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("pivotX"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("transform/anchorPoint/y"), aPlaybackNode.getProperty("outputTime"), aLayer.getProperty("pivotY"));
		
		var masks = aAnimationData.metaData.getObject("masks");
		var currentArray = masks;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			var mask = graphicsLayer.setMaskUsage(true).getMask();
			
			for(var i = 0; i < currentArrayLength; i++) {
				var currentMaskData = currentArray[i];
				var currentMaskPath = currentMaskData.getObject("path");
				var currentMaskMode = currentMaskData.getObject("maskMode");
				
				if(currentMaskMode === 6414) {
					var outSideMaskCurveDrawer = CurveDrawer2d.create(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
					outSideMaskCurveDrawer.getProperty("endParameter").setValue(4);
					mask.addCurve(outSideMaskCurveDrawer);
				}
				
				var maskCurveDrawer = CurveDrawer2d.create(null);
				
				dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject(currentMaskPath + "/maskPath"), aPlaybackNode.getProperty("outputTime"), maskCurveDrawer.getProperty("curve"));
				var maxParameterNode = GetMaxParameterOnCurveNode.create(maskCurveDrawer.getProperty("curve"));
				maskCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
				
				mask.addCurve(maskCurveDrawer);
			}
		}
		
		if(timelines.select("effects/stroke/path")) {
			console.log(">>>>>");
			
			var strokeLayer = aLayer.getChildByPath("effects/stroke");
			
			var strokeCurveDrawer = CurveDrawer2d.create(null);
			
			var maskIndexTimeline = timelines.currentSelectedItem;
			//METODO: can this switch?
			var currentMaskData = masks[maskIndexTimeline.getValueAt(0)-1];
			var currentMaskPath = currentMaskData.getObject("path");
			
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject(currentMaskPath + "/maskPath"), aPlaybackNode.getProperty("outputTime"), strokeCurveDrawer.getProperty("curve"));
			var maxParameterNode = GetMaxParameterOnCurveNode.create(maskCurveDrawer.getProperty("curve"));
			
			//METODO: add parameter animation
			var startMultiplierNode = MultiplicationNode.create(0, maxParameterNode.getProperty("outputParameter"));
			var endMultiplierNode = MultiplicationNode.create(1, maxParameterNode.getProperty("outputParameter"));
			
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("effects/stroke/start"), aPlaybackNode.getProperty("outputTime"), startMultiplierNode.getProperty("inputValue1"));
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(timelines.getObject("effects/stroke/end"), aPlaybackNode.getProperty("outputTime"), endMultiplierNode.getProperty("inputValue1"));
			
			//MENOTE: start can be higher than end
			
			strokeCurveDrawer.getProperty("startParameter").connectInput(startMultiplierNode.getProperty("outputValue"));
			strokeCurveDrawer.getProperty("endParameter").connectInput(endMultiplierNode.getProperty("outputValue"));
			
			strokeLayer.setStrokeStyle(1, "#000000");
			
			var currentGraphics = strokeLayer._getCurrentDrawingLayer();
			currentGraphics.addCurve(strokeCurveDrawer);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});