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
	var CanvasImageGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var CreateCircleCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateCircleCurveNode");
	var RgbaColorFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.data.color.RgbaColorFromValuesNode");
	var CssStringFromColorNode = dbm.importClass("com.developedbyme.flow.nodes.data.color.CssStringFromColorNode");
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
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
		
		this._dataAssetUrlResolver = UrlResolver.createFromFilePath(this._dataAssetPath);
		
		this._showMissingFiles = true;
		
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
		var duration = parsedAnimationData.metaData.getObject("duration");
		
		playbackNode.getProperty("maxTime").setValue(duration);
		playbackNode.play();
		
		var scale = 0.25;
		
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
			this.setupLayer(currentLayer, currentLayerData, playbackNode, duration);
		}
		
		mainCanvasController.getProperty("display").startUpdating();
	};
	
	objectFunctions.setupLayer = function(aLayer, aAnimationData, aPlaybackNode, aFullDuration) {
		
		var timelines = aAnimationData.data;
		
		var layerWidth = aAnimationData.metaData.getObject("width");
		var layerHeight = aAnimationData.metaData.getObject("height");
		
		var inPoint = aAnimationData.metaData.getObject("inPoint");
		var outPoint = aAnimationData.metaData.getObject("outPoint");
		if(inPoint !== 0 || outPoint !== aFullDuration) {
			var renderProperty = aLayer.getProperty("render");
			var retnderTimeline = Timeline.create(false);
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(retnderTimeline, aPlaybackNode.getProperty("outputTime"), renderProperty);
			
			retnderTimeline.setValueAt(true, inPoint);
			retnderTimeline.setValueAt(false, outPoint);
		}
		
		var graphicsLayer = aLayer.getChildByPath("graphics");
		
		var footageType = aAnimationData.metaData.getObject("footageType");
		if(footageType === "solid") {
			var color = aAnimationData.metaData.getObject("color");
			graphicsLayer.setFillStyle(color.getCssString());
			graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
		}
		else if(footageType === "shape") {
			var shapes = aAnimationData.metaData.getObject("shapes");
			this.generateShapes(aLayer, shapes.getRoot(), timelines, aPlaybackNode);
		}
		else if(footageType === "image") {
			var filePath = this._dataAssetUrlResolver.getAbsolutePath(aAnimationData.metaData.getObject("file"));
			var imageAsset = dbm.singletons.dbmAssetRepository.getAsset(filePath);
			imageAsset.load();
			
			var graphicsPart = CanvasImageGraphics2d.createConnectedImage(imageAsset.getProperty("data"), layerWidth, layerHeight);
			graphicsLayer.addDrawingPart(graphicsPart);
		}
		else if(footageType === "missingFile") {
			if(this._showMissingFiles) {
				graphicsLayer.setStrokeStyle(1, "rgba(0, 0, 0, 1)");
				graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
				graphicsLayer.moveTo(0, 0);
				graphicsLayer.lineTo(layerWidth, layerHeight);
				graphicsLayer.moveTo(0, layerHeight);
				graphicsLayer.lineTo(layerWidth, 0);
			}
		}
		else {
			console.log("Using default color");
			graphicsLayer.setFillStyle("rgba(0, 0, 0, 0.1)");
			graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
		}
		
		this.applyTransformToLayer(aLayer, timelines, "", aPlaybackNode.getProperty("outputTime"));
		
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
	
	objectFunctions.applyTransformToLayer = function(aLayer, aTimelines, aPrefix, aTimeProperty) {
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/position/x"), aTimeProperty, aLayer.getProperty("x"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/position/y"), aTimeProperty, aLayer.getProperty("y"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/scale/x"), aTimeProperty, aLayer.getProperty("scaleX"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/scale/y"), aTimeProperty, aLayer.getProperty("scaleY"));
		
		if(aTimelines.select(aPrefix + "transform/rotation") || aTimelines.select(aPrefix + "transform/zRotation")) {
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.currentSelectedItem, aTimeProperty, aLayer.getProperty("rotate"));
		}
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/opacity"), aTimeProperty, aLayer.getProperty("alpha"));
		
		CanvasLayer2d.addPivotToLayer(aLayer);
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/anchorPoint/x"), aTimeProperty, aLayer.getProperty("pivotX"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "transform/anchorPoint/y"), aTimeProperty, aLayer.getProperty("pivotY"));
		
	};
	
	objectFunctions.generateShapes = function(aCurrentLayer, aCurrentGroup, aTimelines, aPlaybackNode) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::generateShapes");
		//console.log(aCurrentLayer, aCurrentGroup, aTimelines, aPlaybackNode);
		
		var currentGraphics = aCurrentLayer._getCurrentDrawingLayer();
		currentGraphics.moveWhenSwitchingCurves = true;
		currentGraphics.scaleStrokes = true;
		
		var currentArray = aCurrentGroup.getChildren();
		var currnetArrayLength = currentArray.length;
		for(var i = 0; i < currnetArrayLength; i++) {
			var currentData = currentArray[i];
			var currentType = currentData.getAttribute("type");
			var currentPathPrefix = currentData.data;
			
			switch(currentType) {
				case "group":
					var newLayer = aCurrentLayer.getChildByPath(currentData.getName());
					this.generateShapes(newLayer, currentData, aTimelines, aPlaybackNode);
					this.applyTransformToLayer(newLayer, aTimelines, currentPathPrefix + "/", aPlaybackNode.getProperty("outputTime"));
					break;
				case "shape":
					console.log(">>>>>");
					var currentCurveDrawer = CurveDrawer2d.create(null);
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/path"), aPlaybackNode.getProperty("outputTime"), currentCurveDrawer.getProperty("curve"));
					
					var maxParameterNode = GetMaxParameterOnCurveNode.create(currentCurveDrawer.getProperty("curve"));
					currentCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
					
					currentGraphics.addCurve(currentCurveDrawer);
					break;
				case "ellipse":
					var currentCurveCreator = CreateCircleCurveNode.create(); //METODO: do ellipse instead of circle
					var currentCurveDrawer = CurveDrawer2d.create(currentCurveCreator.getProperty("outputCurve"));
					
					var radiusMultiplierNode = MultiplicationNode.create(1, 0.5);
					currentCurveCreator.getProperty("radius").connectInput(radiusMultiplierNode.getProperty("outputValue"));
					currentCurveCreator.getProperty("radius").addDestroyableObject(radiusMultiplierNode);
					
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/position/x"), aPlaybackNode.getProperty("outputTime"), currentCurveCreator.getProperty("x"));
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/position/y"), aPlaybackNode.getProperty("outputTime"), currentCurveCreator.getProperty("y"));
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/size/x"), aPlaybackNode.getProperty("outputTime"), radiusMultiplierNode.getProperty("inputValue1"));
					
					var maxParameterNode = GetMaxParameterOnCurveNode.create(currentCurveCreator.getProperty("outputCurve"));
					currentCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
					
					currentGraphics.addCurve(currentCurveDrawer);
					break;
				case "stroke":
					this.applyColor(currentGraphics.getProperty("strokeStyle"), aTimelines, currentPathPrefix, aPlaybackNode.getProperty("outputTime"));
					
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/strokeWidth"), aPlaybackNode.getProperty("outputTime"), currentGraphics.getProperty("lineWidth"));
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/lineCap"), aPlaybackNode.getProperty("outputTime"), currentGraphics.getProperty("lineCap"));
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/lineJoin"), aPlaybackNode.getProperty("outputTime"), currentGraphics.getProperty("lineJoin"));
					dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(currentPathPrefix + "/miterLimit"), aPlaybackNode.getProperty("outputTime"), currentGraphics.getProperty("miterLimit"));
					
					break;
				case "fill":
					this.applyColor(currentGraphics.getProperty("fillStyle"), aTimelines, currentPathPrefix, aPlaybackNode.getProperty("outputTime"));
					break;
				default:
					console.log(currentType);
					//METODO: error message
					break;
			}
		}
	};
	
	objectFunctions.applyColor = function(aOutputProperty, aTimelines, aPrefix, aTimeProperty) {
		
		var colorCreatorNode = RgbaColorFromValuesNode.create();
		var cssStringNode = CssStringFromColorNode.create(colorCreatorNode.getProperty("outputColor"));
		aOutputProperty.connectInput(cssStringNode.getProperty("outputValue"));
		
		var opacityMultiplierNode = MultiplicationNode.create(1, 1);
		
		colorCreatorNode.getProperty("alpha").connectInput(opacityMultiplierNode.getProperty("outputValue"));
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "/color/r"), aTimeProperty, colorCreatorNode.getProperty("red"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "/color/g"), aTimeProperty, colorCreatorNode.getProperty("green"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "/color/b"), aTimeProperty, colorCreatorNode.getProperty("blue"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "/color/a"), aTimeProperty, opacityMultiplierNode.getProperty("inputValue1"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(aTimelines.getObject(aPrefix + "/opacity"), aTimeProperty, opacityMultiplierNode.getProperty("inputValue2"));
		
		aOutputProperty.addDestroyableObject(colorCreatorNode);
		aOutputProperty.addDestroyableObject(cssStringNode);
		aOutputProperty.addDestroyableObject(colorCreatorNode);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});