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
	var CanvasRenderLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasRenderLayer2d");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var CreateCircleCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateCircleCurveNode");
	var RgbaColorFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.data.color.RgbaColorFromValuesNode");
	var CssStringFromColorNode = dbm.importClass("com.developedbyme.flow.nodes.data.color.CssStringFromColorNode");
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var FlowGate = dbm.importClass("com.developedbyme.flow.FlowGate");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var PlaybackMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.PlaybackMetaDataTypes");
	var TrackMatteTypes = dbm.importClass("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes");
	
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
		
		var timeFlowGate = FlowGate.create(playbackNode.getProperty("outputTime"));
		dbm.singletons.dbmFlowManager.addFlowGate(timeFlowGate);
		
		var scale = 0.25;
		
		var width = parsedAnimationData.metaData.getObject("width");
		var height = parsedAnimationData.metaData.getObject("height");
		
		var mainCanvasView = CanvasView.create(this._contentHolder, true, "2d", {"width": Math.ceil(scale*width), "height": Math.ceil(scale*height)});
		var mainCanvasController = mainCanvasView.getController();
		
		
		var mainLayer = mainCanvasController.getLayer("main");
		mainLayer.getProperty("scaleX").setValue(scale);
		mainLayer.getProperty("scaleY").setValue(scale);
		
		var backgroundLayer = mainLayer.getChildByPath("background");
		backgroundLayer.setFillStyle(parsedAnimationData.metaData.getObject("backgroundColor").getCssString());
		backgroundLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, width, height));
		
		var layerTreeStructure = parsedAnimationData.data;
		
		console.log(">>>>", layerTreeStructure);
		
		console.log(playbackNode);
		
		this.setupLayerTreeStructure(layerTreeStructure.getRoot(), mainLayer, timeFlowGate.getProperty("outputValue"), duration, mainCanvasController);
		
		mainCanvasController.getProperty("display").startUpdating();
	};
	
	objectFunctions.setupLayerTreeStructure = function(aTreeStructureItem, aLayer, aTimeProperty, aDuration, aCanvasController) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::setupLayerTreeStructure");
		//console.log(aTreeStructureItem, aLayer);
		
		var currentArray = aTreeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIndex = currentArrayLength-i-1;
			var currentLayerTreeStructureItem = currentArray[currentIndex];
			var currentLayerData = currentLayerTreeStructureItem.data;
			
			var layerName = currentLayerTreeStructureItem.getName();
			
			
			
			var currentType = currentLayerData.metaData.getObject("type");
			if(currentType === "layer") {
				var currentLayer = aLayer.getChildByPath(layerName);
				var childLayer = currentLayer.getChildByPath("children");
				var contentLayer = currentLayer.getChildByPath("content");
				this.setupLayer(currentLayer, currentLayerData, aTimeProperty, aDuration);
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, childLayer, aTimeProperty, aDuration, aCanvasController);
			}
			else if(currentType === "trackMatte") {
				
				var newTreeStrcutureItem = TreeStructureItem.create(layerName);
				
				//METODO: set size dynamically
				var renderWidth = 500;
				var renderHeight = 500;
				var renderOffsetX = -0.5*renderWidth;
				var renderOffsetY = -0.5*renderHeight;
				
				var currentLayer = CanvasRenderLayer2d.create(renderOffsetX, renderOffsetY, renderWidth, renderHeight);
				newTreeStrcutureItem.data = currentLayer;
				currentLayer._linkRegistration_setTreeStructureItem(newTreeStrcutureItem);
				aLayer.getTreeStructureItem().addChild(newTreeStrcutureItem);
				aCanvasController.getProperty("graphicsUpdate").connectInput(currentLayer.getProperty("graphicsUpdate"));
				
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, currentLayer, aTimeProperty, aDuration, aCanvasController);
				
				
				var renderedChildren = newTreeStrcutureItem.getChildren();
				
				var renderedMaskLayer = renderedChildren[1];
				var renderedContentLayer = renderedChildren[0];
				
				renderedContentLayer.retain();
				newTreeStrcutureItem.removeChild(renderedContentLayer);
				newTreeStrcutureItem.addChild(renderedContentLayer);
				renderedContentLayer.release();
				
				var trackMatteType = currentLayerData.metaData.getObject("trackMatteType");
				switch(trackMatteType) {
					case TrackMatteTypes.ALPHA:
						renderedContentLayer.data.setPropertyInput("compositeOperation", "source-in");
						break;
					case TrackMatteTypes.ALPHA_INVERTED:
						renderedContentLayer.data.setPropertyInput("compositeOperation", "source-out");
						break;
					case TrackMatteTypes.LUMA:
					case TrackMatteTypes.LUMA_INVERTED:
						//METODO: error message
						break;
					default:
						//METODO: error message
						break;
				}
			}
			else {
				//METODO: error message
				var currentLayer = aLayer.getChildByPath(layerName);
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, currentLayer, aTimeProperty, aDuration, aCanvasController);
			}
			
			
		}
	};
	
	objectFunctions.setupLayer = function(aLayer, aAnimationData, aTimeProperty, aFullDuration) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::setupLayer");
		//console.log(aLayer, aAnimationData, aPlaybackNode, aFullDuration);
		
		var timelines = aAnimationData.data;
		
		var layerWidth = aAnimationData.metaData.getObject("width");
		var layerHeight = aAnimationData.metaData.getObject("height");
		
		var contentLayer = aLayer.getChildByPath("content");
		var graphicsLayer = contentLayer.getChildByPath("graphics");
		
		var inPoint = aAnimationData.metaData.getObject(PlaybackMetaDataTypes.START_TIME);
		var outPoint = aAnimationData.metaData.getObject(PlaybackMetaDataTypes.END_TIME);
		if(inPoint !== 0 || outPoint !== aFullDuration) {
			var renderProperty = contentLayer.getProperty("render");
			var renderTimeline = Timeline.create(false);
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(renderTimeline, aTimeProperty, renderProperty);
			
			renderTimeline.setValueAt(true, inPoint);
			renderTimeline.setValueAt(false, outPoint);
		}
		
		
		
		var footageType = aAnimationData.metaData.getObject("footageType");
		if(footageType === "solid") {
			var color = aAnimationData.metaData.getObject("color");
			graphicsLayer.setFillStyle(color.getCssString());
			graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
		}
		else if(footageType === "shape") {
			var shapes = aAnimationData.metaData.getObject("shapes");
			this.generateShapes(graphicsLayer, shapes.getRoot(), timelines, aTimeProperty);
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
		else if(footageType === "none") {
			//MENOTE: do nothing
		}
		else {
			console.log("Using default color");
			graphicsLayer.setFillStyle("rgba(0, 0, 0, 0.1)");
			graphicsLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, layerWidth, layerHeight));
		}
		
		this.applyTransformToLayerWithOrientation(aLayer, timelines, "", aTimeProperty);
		this.applyAlphaToLayer(contentLayer, timelines, "", aTimeProperty);
		
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
				
				this._linkComplexDataToProperty(timelines.getProperty(currentMaskPath + "/maskPath"), aTimeProperty, maskCurveDrawer.getProperty("curve"));
				
				var maxParameterNode = GetMaxParameterOnCurveNode.create(maskCurveDrawer.getProperty("curve"));
				maskCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
				
				mask.addCurve(maskCurveDrawer);
			}
		}
		
		if(timelines.hasProperty("effects/stroke/path")) {
			
			var strokeLayer = contentLayer.getChildByPath("effects/stroke");
			
			var strokeCurveDrawer = CurveDrawer2d.create(null);
			
			var maskIndexTimeline = timelines.getProperty("effects/stroke/path");
			//METODO: can this switch?
			var currentMaskData = masks[maskIndexTimeline.getValue()-1];
			var currentMaskPath = currentMaskData.getObject("path");
			
			this._linkComplexDataToProperty(timelines.getProperty(currentMaskPath + "/maskPath"), aTimeProperty, strokeCurveDrawer.getProperty("curve"));
			var maxParameterNode = GetMaxParameterOnCurveNode.create(maskCurveDrawer.getProperty("curve"));
			
			var startMultiplierNode = MultiplicationNode.create(0, maxParameterNode.getProperty("outputParameter"));
			var endMultiplierNode = MultiplicationNode.create(1, maxParameterNode.getProperty("outputParameter"));
			
			this._linkDataToProperty(timelines.getProperty(aPrefix + "effects/stroke/start"), aTimeProperty, startMultiplierNode.getProperty("inputValue1"));
			this._linkDataToProperty(timelines.getProperty(aPrefix + "effects/stroke/end"), aTimeProperty, endMultiplierNode.getProperty("inputValue1"));
			
			strokeCurveDrawer.getProperty("startParameter").connectInput(startMultiplierNode.getProperty("outputValue"));
			strokeCurveDrawer.getProperty("endParameter").connectInput(endMultiplierNode.getProperty("outputValue"));
			
			//METODO: set correct color
			strokeLayer.setStrokeStyle(1, "#000000");
			
			var currentGraphics = strokeLayer._getCurrentDrawingLayer();
			currentGraphics.addCurve(strokeCurveDrawer);
		}
	};
	
	objectFunctions.applyTransformToLayerWithOrientation = function(aLayer, aTimelines, aPrefix, aTimeProperty) {
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/position/x"), aTimeProperty, aLayer.getProperty("x"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/position/y"), aTimeProperty, aLayer.getProperty("y"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/scale/x"), aTimeProperty, aLayer.getProperty("scaleX"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/scale/y"), aTimeProperty, aLayer.getProperty("scaleY"));
		
		var rotationProperty = (aTimelines.hasProperty(aPrefix + "transform/rotation")) ? aTimelines.getProperty(aPrefix + "transform/rotation") : aTimelines.getProperty(aPrefix + "transform/zRotation");
		
		var orientationRotateAdditionNode = AdditionNode.create(0, 0);
		aLayer.getProperty("rotate").connectInput(orientationRotateAdditionNode.getProperty("outputValue"));
		
		this._linkDataToProperty(rotationProperty, aTimeProperty, orientationRotateAdditionNode.getProperty("inputValue1"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/orientation/z"), aTimeProperty, orientationRotateAdditionNode.getProperty("inputValue2"));
		
		CanvasLayer2d.addPivotToLayer(aLayer);
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/x"), aTimeProperty, aLayer.getProperty("pivotX"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/y"), aTimeProperty, aLayer.getProperty("pivotY"));
		
	};
	
	objectFunctions.applyTransformToLayer = function(aLayer, aTimelines, aPrefix, aTimeProperty) {
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/position/x"), aTimeProperty, aLayer.getProperty("x"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/position/y"), aTimeProperty, aLayer.getProperty("y"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/scale/x"), aTimeProperty, aLayer.getProperty("scaleX"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/scale/y"), aTimeProperty, aLayer.getProperty("scaleY"));
		
		var rotationProperty = (aTimelines.hasProperty(aPrefix + "transform/rotation")) ? aTimelines.getProperty(aPrefix + "transform/rotation") : aTimelines.getProperty(aPrefix + "transform/zRotation");
		this._linkDataToProperty(rotationProperty, aTimeProperty, aTimeProperty, aLayer.getProperty("rotate"));
		
		CanvasLayer2d.addPivotToLayer(aLayer);
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/x"), aTimeProperty, aLayer.getProperty("pivotX"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/y"), aTimeProperty, aLayer.getProperty("pivotY"));
		
	};
	
	objectFunctions.applyAlphaToLayer = function(aLayer, aTimelines, aPrefix, aTimeProperty) {
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/opacity"), aTimeProperty, aLayer.getProperty("alpha"));
		
	};
	
	objectFunctions.generateShapes = function(aCurrentLayer, aCurrentGroup, aTimelines, aTimeProperty) {
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
					this.applyTransformToLayer(newLayer, aTimelines, currentPathPrefix + "/", aTimeProperty);
					this.applyAlphaToLayer(newLayer, aTimelines, currentPathPrefix + "/", aTimeProperty);
					break;
				case "shape":
					var currentCurveDrawer = CurveDrawer2d.create(null);
					this._linkComplexDataToProperty(aTimelines.getProperty(currentPathPrefix + "/path"), aTimeProperty, currentCurveDrawer.getProperty("curve"));
					
					
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
					
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/position/x"), aTimeProperty, currentCurveCreator.getProperty("x"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/position/y"), aTimeProperty, currentCurveCreator.getProperty("y"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/size/x"), aTimeProperty, radiusMultiplierNode.getProperty("inputValue1"));
					
					
					var maxParameterNode = GetMaxParameterOnCurveNode.create(currentCurveCreator.getProperty("outputCurve"));
					currentCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
					
					currentGraphics.addCurve(currentCurveDrawer);
					break;
				case "stroke":
					this.applyColor(currentGraphics.getProperty("strokeStyle"), aTimelines, currentPathPrefix, aTimeProperty);
					
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/strokeWidth"), aTimeProperty, currentGraphics.getProperty("lineWidth"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/lineCap"), aTimeProperty, currentGraphics.getProperty("lineCap"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/lineJoin"), aTimeProperty, currentGraphics.getProperty("lineJoin"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/miterLimit"), aTimeProperty, currentGraphics.getProperty("miterLimit"));
					
					break;
				case "fill":
					this.applyColor(currentGraphics.getProperty("fillStyle"), aTimelines, currentPathPrefix, aTimeProperty);
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
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "/color/r"), aTimeProperty, colorCreatorNode.getProperty("red"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "/color/g"), aTimeProperty, colorCreatorNode.getProperty("green"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "/color/b"), aTimeProperty, colorCreatorNode.getProperty("blue"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "/color/a"), aTimeProperty, opacityMultiplierNode.getProperty("inputValue1"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "/opacity"), aTimeProperty, opacityMultiplierNode.getProperty("inputValue2"));
		
		aOutputProperty.addDestroyableObject(colorCreatorNode);
		aOutputProperty.addDestroyableObject(cssStringNode);
		aOutputProperty.addDestroyableObject(colorCreatorNode);
	};
	
	objectFunctions._linkDataToProperty = function(aDataProperty, aTimeProperty, aOutputProperty) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_linkDataToPropert");
		//console.log(aDataProperty, aTimeProperty, aOutputProperty);
		
		if(aDataProperty.hasAnimationController()) {
			var flowGate = FlowGate.create();
			dbm.singletons.dbmFlowManager.addFlowGate(flowGate);
			aOutputProperty.connectInput(flowGate.getProperty("outputValue"));
			dbm.singletons.dbmAnimationManager.setupTimelineConnection(aDataProperty.getAnimationController(), aTimeProperty, flowGate.getProperty("inputValue"));
		}
		else {
			aOutputProperty.connectInput(aDataProperty);
		}
	};
	
	objectFunctions._linkComplexDataToProperty = function(aDataProperty, aTimeProperty, aOutputProperty) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_linkDataToPropert");
		//console.log(aDataProperty, aTimeProperty, aOutputProperty);
		
		if(aDataProperty.hasAnimationController()) {
			var flowGate = FlowGate.create();
			dbm.singletons.dbmFlowManager.addFlowGate(flowGate);
			flowGate.getProperty("outputValue").setAlwaysUpdateFlow(true);
			aOutputProperty.connectInput(flowGate.getProperty("outputValue"));
			dbm.singletons.dbmAnimationManager.setupTimelineConnectionWithComplexValue(aDataProperty.getAnimationController(), aTimeProperty, flowGate.getProperty("inputValue"));
			//dbm.singletons.dbmAnimationManager.setupTimelineConnectionWithComplexValue(aDataProperty.getAnimationController(), aTimeProperty, aOutputProperty);
		}
		else {
			aOutputProperty.connectInput(aDataProperty);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});