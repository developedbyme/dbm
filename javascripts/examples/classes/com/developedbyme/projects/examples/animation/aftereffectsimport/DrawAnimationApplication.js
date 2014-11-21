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
	var VideoView = dbm.importClass("com.developedbyme.gui.media.video.VideoView");
	var ClampNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.ClampNode");
	var RepeatedRangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var CreateWedgeInBoxCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var IllustratorFileGenerator = dbm.importClass("com.developedbyme.utils.canvas.generators.IllustratorFileGenerator");
	var DataSelector = dbm.importClass("com.developedbyme.utils.data.DataSelector");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var CanvasControllerModificationFunctions = dbm.importClass("com.developedbyme.utils.canvas.modify.CanvasControllerModificationFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var PlaybackMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.PlaybackMetaDataTypes");
	var TrackMatteTypes = dbm.importClass("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	
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
		this._canvasController = null;
		this._playbackNode = null;
		
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
		var exportData = dbm.singletons.dbmDataManager.getData(dataName);
		var compositionsData = exportData.data;
		var parsedAnimationData = compositionsData[exportData.metaData.getObject("mainComposition")];
		var duration = parsedAnimationData.metaData.getObject("duration");
		
		playbackNode.getProperty("maxTime").setValue(duration);
		//playbackNode.play();
		
		var timeFlowGate = FlowGate.create(playbackNode.getProperty("outputTime"));
		dbm.singletons.dbmFlowManager.addFlowGate(timeFlowGate);
		
		var scale = 0.5;
		
		var width = parsedAnimationData.metaData.getObject("width");
		var height = parsedAnimationData.metaData.getObject("height");
		
		var scaledWidth = Math.ceil(scale*width);
		var scaledHeight = Math.ceil(scale*height);
		
		var maxWidth = 1024;
		var maxHeight = 768;
		
		var renderWidth = Math.min(scaledWidth, maxWidth);
		var renderHeight = Math.min(scaledHeight, maxHeight);
		
		var mainCanvasView = CanvasView.create(this._contentHolder, true, "2d", {"width": renderWidth, "height": renderHeight});
		var mainCanvasController = mainCanvasView.getController();
		this._canvasController = mainCanvasController;
		
		var mainLayer = mainCanvasController.getLayer("main");
		mainLayer.getProperty("x").setValue(Math.round(0.5*(renderWidth-scaledWidth)));
		mainLayer.getProperty("y").setValue(Math.round(0.5*(renderHeight-scaledHeight)));
		mainLayer.getProperty("scaleX").setValue(scale);
		mainLayer.getProperty("scaleY").setValue(scale);
		
		var backgroundLayer = mainLayer.getChildByPath("background");
		backgroundLayer.setFillStyle(parsedAnimationData.metaData.getObject("backgroundColor").getCssString());
		backgroundLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, width, height));
		
		var layerTreeStructure = parsedAnimationData.data;
		
		this._playbackNode = playbackNode;
		
		this.setupLayerTreeStructure(layerTreeStructure.getRoot(), mainLayer, timeFlowGate.getProperty("outputValue"), duration, compositionsData, false);
		
		console.log(mainCanvasController);
		
		mainCanvasController.getProperty("display").startUpdating();
	};
	
	objectFunctions.setupLayerTreeStructure = function(aTreeStructureItem, aLayer, aTimeProperty, aDuration, aCompositions, aShowHiddenLayers) {
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
				var contentLayer = currentLayer.getChildByPath("content");
				var childLayer = currentLayer.getChildByPath("children");
				
				
				this.setupLayer(currentLayer, currentLayerData, aTimeProperty, aDuration, aCompositions, aShowHiddenLayers);
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, childLayer, aTimeProperty, aDuration, aCompositions, false);
			}
			else if(currentType === "trackMatte") {
				
				var newTreeStrcutureItem = TreeStructureItem.create(layerName);
				
				var currentLayer = CanvasRenderLayer2d.create(0, 0, 0, 0); //MENOTE: sized and position is set by mask layer
				newTreeStrcutureItem.data = currentLayer;
				currentLayer._linkRegistration_setTreeStructureItem(newTreeStrcutureItem);
				aLayer.getTreeStructureItem().addChild(newTreeStrcutureItem);
				aLayer.getTreeStructureItem().getInheritedAttribute("graphicsUpdate").connectInput(currentLayer.getProperty("graphicsUpdate"));
				
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, currentLayer, aTimeProperty, aDuration, aCompositions, true);
				
				
				var renderedChildren = newTreeStrcutureItem.getChildren();
				
				var renderedMaskLayer = renderedChildren[1];
				currentLayer.getProperty("renderWidth").setValue(renderedMaskLayer.data.getDynamicVariable("width"));
				currentLayer.getProperty("renderHeight").setValue(renderedMaskLayer.data.getDynamicVariable("height"));
				//METODO: link render offset
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
						ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "setupLayerTreeStructure", "Luma mask is not implemented.");
						
						renderedContentLayer.data.setPropertyInput("compositeOperation", "source-in"); //MEDEBUG
						break;
					case TrackMatteTypes.LUMA_INVERTED:
						ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "setupLayerTreeStructure", "Inverted luma mask is not implemented.");
						
						renderedContentLayer.data.setPropertyInput("compositeOperation", "source-out"); //MEDEBUG
						break;
					default:
						//METODO: error message
						break;
				}
			}
			else {
				//METODO: error message
				var currentLayer = aLayer.getChildByPath(layerName);
				this.setupLayerTreeStructure(currentLayerTreeStructureItem, currentLayer, aTimeProperty, aDuration, aCompositions, false);
			}
			
			
		}
	};
	
	objectFunctions.setupLayer = function(aLayer, aAnimationData, aTimeProperty, aFullDuration, aCompositions, aShowHiddenLayers) {
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
		
		
		var overrideLayerVisuals = false;
		
		var hasStroke = timelines.hasProperty("effects/stroke/path");
		if(hasStroke) {
			var strokeEffectType = timelines.getProperty("effects/stroke/paintStyle").getValue(); //METODO: this can change over time. How to handle that?
			overrideLayerVisuals |= (strokeEffectType === 2);
		}
		var isShowing = (!overrideLayerVisuals) && (aShowHiddenLayers || aAnimationData.metaData.getObject("enabled"));
		
		var footageType = isShowing ? aAnimationData.metaData.getObject("footageType") : "none";
		if(footageType === "solid") {
			//console.log(footageType, layerWidth, layerHeight);
			
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
		else if(footageType === "vectorGraphics") {
			var filePath = this._dataAssetUrlResolver.getAbsolutePath(aAnimationData.metaData.getObject("file"));
			var vectorAsset = dbm.singletons.dbmAssetRepository.getAsset(filePath);
			
			this.drawVectorLayer(vectorAsset, aAnimationData.metaData.getObject("layer"), graphicsLayer, layerWidth, layerHeight);
			vectorAsset.load();
		}
		else if(footageType === "video") {
			
			var filePath = this._dataAssetUrlResolver.getAbsolutePath(aAnimationData.metaData.getObject("file"));
			
			//METODO: set dimensions dynamically
			var playbackView = VideoView.createFromAsset(this._contentHolder, false, filePath, {"width": 800, "height": 600});
			playbackView.setPlaybackNode(this._playbackNode);
			
			playbackView._stateTimeline.setValueAt(PlaybackStateTypes.PLAYING, inPoint);
			playbackView._startTimeTimeline.setValueAt(inPoint, inPoint);
			playbackView._startPositionTimeline.setValueAt(0, inPoint);
			
			var graphicsPart = CanvasImageGraphics2d.createConnectedImage(playbackView.getProperty("element"), 800, 600);
			graphicsPart.getProperty("graphicsUpdate").connectInput(playbackView.getProperty("display"));
			graphicsLayer.addDrawingPart(graphicsPart);
		}
		else if(footageType === "composition") {
			
			var compositionIndex = aAnimationData.metaData.getObject("composition");
			var usedComposition = aCompositions[compositionIndex];
			
			var duration = usedComposition.metaData.getObject("duration");
			
			var timeAdjustmentNode = AdditionNode.create(aTimeProperty, -1*inPoint);
			this.setupLayerTreeStructure(usedComposition.data.getRoot(), contentLayer, timeAdjustmentNode.getProperty("outputValue"), duration, aCompositions);
			
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
		
		aLayer.setDynamicVariable("width", layerWidth);
		aLayer.setDynamicVariable("height", layerHeight);
		
		this.applyTransformToLayerWithOrientation(aLayer, timelines, "", aTimeProperty);
		this.applyAlphaToLayer(contentLayer, timelines, "", aTimeProperty);
		
		var masks = aAnimationData.metaData.getObject("masks");
		if(!overrideLayerVisuals) {
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
		}
		
		if(hasStroke) {
			
			var strokeLayer = contentLayer.getChildByPath("effects/stroke");
			
			var currentGraphics = strokeLayer._getCurrentDrawingLayer();
			currentGraphics.moveWhenSwitchingCurves = true;
			
			var allMasks = timelines.getProperty("effects/stroke/allMasks").getValue() === 1;
			
			var inputProperties = PropertiesHolder.create({"startParameter": 0, "endParameter": 0, "lineWidth": 0, "strokeStyle": null});
			this._linkDataToProperty(timelines.getProperty("effects/stroke/start"), aTimeProperty, inputProperties.getProperty("startParameter"));
			this._linkDataToProperty(timelines.getProperty("effects/stroke/end"), aTimeProperty, inputProperties.getProperty("endParameter"));
			this._linkDataToProperty(timelines.getProperty("effects/stroke/brushSize"), aTimeProperty, inputProperties.getProperty("lineWidth"));
			this.applyColor(inputProperties.getProperty("strokeStyle"), timelines, "effects/stroke", aTimeProperty);
			
			if(!allMasks) {
				var maskIndexTimeline = timelines.getProperty("effects/stroke/path");
			
				var maskIndex = maskIndexTimeline.getValue()-1; //MENOTE: this can't switch in time
				if(maskIndex >= 0) { //METODO: what does mask index -1 mean?
					var currentMaskData = masks[maskIndex];
					var currentMaskPath = currentMaskData.getObject("path");
					
					var pathProperty = timelines.getProperty(currentMaskPath + "/maskPath");
					
					this._addStrokeEffect(currentGraphics, pathProperty, inputProperties.getProperty("startParameter"), inputProperties.getProperty("endParameter"), inputProperties.getProperty("lineWidth"), inputProperties.getProperty("strokeStyle"), aTimeProperty);
					
				}
				else {
					//METODO: what does mask index -1 mean?
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "setupLayer", "Mask path is not set.");
				}
			}
			else {
				
				var currentArray = masks;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentMaskData = masks[i];
					var currentMaskPath = currentMaskData.getObject("path");
					
					var pathProperty = timelines.getProperty(currentMaskPath + "/maskPath");
					
					this._addStrokeEffect(currentGraphics, pathProperty, inputProperties.getProperty("startParameter"), inputProperties.getProperty("endParameter"), inputProperties.getProperty("lineWidth"), inputProperties.getProperty("strokeStyle"), aTimeProperty);
					
				}
			}
			
		}
		
		if(timelines.hasProperty("effects/radialWipe/transitionCompletion")) {
			
			var maskedLayer = CanvasControllerModificationFunctions.createInsertedLayer(aLayer);
			
			var startAngleOffsetNode = AdditionNode.create(0, -0.5*Math.PI);
			this._linkComplexDataToProperty(timelines.getProperty("effects/radialWipe/startAngle"), aTimeProperty, startAngleOffsetNode.getProperty("inputValue1"));
			
			var invertParameterNode = SubtractionNode.create(1, 0);
			this._linkComplexDataToProperty(timelines.getProperty("effects/radialWipe/transitionCompletion"), aTimeProperty, invertParameterNode.getProperty("inputValue2"));
			var endAngleMultiplierNode = MultiplicationNode.create(invertParameterNode.getProperty("outputValue"), 2*Math.PI);
			var endDirectionNode = MultiplicationNode.create(endAngleMultiplierNode.getProperty("outputValue"), 1); //METODO
			var endAngleNode = AdditionNode.create(startAngleOffsetNode.getProperty("outputValue"), endDirectionNode.getProperty("outputValue"));
			
			var pivotScaleWidthNode = MultiplicationNode.create(0, 1/layerWidth);
			this._linkComplexDataToProperty(timelines.getProperty("effects/radialWipe/wipeCenter/x"), aTimeProperty, pivotScaleWidthNode.getProperty("inputValue1"));
			var pivotScaleHeightNode = MultiplicationNode.create(0, 1/layerHeight);
			this._linkComplexDataToProperty(timelines.getProperty("effects/radialWipe/wipeCenter/y"), aTimeProperty, pivotScaleHeightNode.getProperty("inputValue1"));
			
			
			var mask = graphicsLayer.setMaskUsage(true).getMask();
			var maskCurveNode = CreateWedgeInBoxCurveNode.create(0, 0, pivotScaleWidthNode.getProperty("outputValue"), pivotScaleHeightNode.getProperty("outputValue"), startAngleOffsetNode.getProperty("outputValue"), endAngleNode.getProperty("outputValue"), layerWidth, layerHeight);
			
			var maskCurveDrawer = CurveDrawer2d.create(maskCurveNode.getProperty("outputCurve"));
			
			var maxParameterNode = GetMaxParameterOnCurveNode.create(maskCurveDrawer.getProperty("curve"));
			maskCurveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
			
			mask.addCurve(maskCurveDrawer);
		}
		
		if(timelines.hasProperty("effects/levels/channel:")) {
			//METODO: find out if histogram data can be accessed somehow
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "setupLayer", "Levels can't be used as histogram data is not accessible in AE.");
		}
	};
	
	objectFunctions._addStrokeEffect = function(aGraphics, aPath, aStartParameter, aEndParameter, aLineWidth, aStrokeStyle, aTimeProperty) {
		
		var strokeCurveDrawer = CurveDrawer2d.create(null);
		aGraphics.addCurve(strokeCurveDrawer);
		
		this._linkComplexDataToProperty(aPath, aTimeProperty, strokeCurveDrawer.getProperty("curve"));
		var maxParameterNode = GetMaxParameterOnCurveNode.create(strokeCurveDrawer.getProperty("curve"));

		var startMultiplierNode = MultiplicationNode.create(aStartParameter, maxParameterNode.getProperty("outputParameter"));
		var endMultiplierNode = MultiplicationNode.create(aEndParameter, maxParameterNode.getProperty("outputParameter"));
		
		strokeCurveDrawer.addDestroyableObject(maxParameterNode);
		strokeCurveDrawer.addDestroyableObject(startMultiplierNode);
		strokeCurveDrawer.addDestroyableObject(endMultiplierNode);
		
		strokeCurveDrawer.getProperty("startParameter").connectInput(startMultiplierNode.getProperty("outputValue"));
		strokeCurveDrawer.getProperty("endParameter").connectInput(endMultiplierNode.getProperty("outputValue"));
		
		aGraphics.getProperty("lineWidth").connectInput(aLineWidth);
		aGraphics.getProperty("strokeStyle").connectInput(aStrokeStyle);
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
		this._linkDataToProperty(rotationProperty, aTimeProperty, aLayer.getProperty("rotate"));
		
		CanvasLayer2d.addPivotToLayer(aLayer);
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/x"), aTimeProperty, aLayer.getProperty("pivotX"));
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/anchorPoint/y"), aTimeProperty, aLayer.getProperty("pivotY"));
		
	};
	
	objectFunctions.applyAlphaToLayer = function(aLayer, aTimelines, aPrefix, aTimeProperty) {
		
		this._linkDataToProperty(aTimelines.getProperty(aPrefix + "transform/opacity"), aTimeProperty, aLayer.getProperty("alpha"));
		
	};
	
	objectFunctions.generateShapes = function(aCurrentLayer, aCurrentGroup, aTimelines, aTimeProperty, aCurves) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::generateShapes");
		//console.log(aCurrentLayer, aCurrentGroup, aTimelines, aTimeProperty);
		
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
					this.generateShapes(newLayer, currentData, aTimelines, aTimeProperty);
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
					var currentCurveCreator = CreateCircleCurveNode.create(0, 0, 1, 8, -0.5*Math.PI); //METODO: do ellipse instead of circle
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
				case "trim":
					var inputProperties = PropertiesHolder.create({"startParameter": 0, "endParameter": 0, "offset": 0, "trimMultipleShapes": 0});
					
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/start"), aTimeProperty, inputProperties.getProperty("startParameter"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/end"), aTimeProperty, inputProperties.getProperty("endParameter"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/offset"), aTimeProperty, inputProperties.getProperty("offset"));
					this._linkDataToProperty(aTimelines.getProperty(currentPathPrefix + "/trimMultipleShapes"), aTimeProperty, inputProperties.getProperty("trimMultipleShapes"));
					
					var offsetDivisionNode = MultiplicationNode.create(inputProperties.getProperty("offset"), 1/(2*Math.PI));
					var startParameterNode = AdditionNode.create(inputProperties.getProperty("startParameter"), offsetDivisionNode.getProperty("outputValue"));
					var lengthNode = SubtractionNode.create(inputProperties.getProperty("endParameter"), inputProperties.getProperty("startParameter"));
					
					var startRepeatedRangeNode = RepeatedRangeNode.create(startParameterNode.getProperty("outputValue"), 0, 1);
					
					
					var endNode = AdditionNode.create(startRepeatedRangeNode.getProperty("outputValue"), lengthNode.getProperty("outputValue"));
					var firstEndNode = ClampNode.create(endNode.getProperty("outputValue"), 0, 1);
					var secondEndOffsetNode = SubtractionNode.create(endNode.getProperty("outputValue"), 1);
					var secondEndNode = ClampNode.create(secondEndOffsetNode.getProperty("outputValue"), 0, 1);
					
					var graphicsArray = new Array();
					CanvasControllerModificationFunctions.getAllGraphics(aCurrentLayer, graphicsArray);
					
					this._trimCurves(graphicsArray, startRepeatedRangeNode.getProperty("outputValue"), firstEndNode.getProperty("outputValue"), secondEndNode.getProperty("outputValue"));
					
					break;
				case "repeater":
					
					var currentTreeStructureItem = aCurrentLayer.getTreeStructureItem();
					var parentLayer = currentTreeStructureItem.getParent().data;
					
					var repeaterLayer = parentLayer.getChildByPath("repeater");
					var repeaterTreeStructureItem = repeaterLayer.getTreeStructureItem();
					
					this.applyTransformToLayer(repeaterLayer, aTimelines, currentPathPrefix + "/", aTimeProperty);
					
					var link = TreeStructureItemLink.create("link", "../..");
					repeaterTreeStructureItem.addChild(link);
					
					//METODO: implement number of repeats
					
					break;
				default:
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "generateShapes", "Vector type " + currentType + " is not implemented.");
					break;
			}
		}
	};
	
	objectFunctions._trimCurves = function(aGraphicsArray, aStartParameter, aEndParameter, aLoopEndParameter) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_trimCurves");
		var currentArray = aGraphicsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGraphics = currentArray[i];
			if(currentGraphics instanceof CanvasGraphics2d) {
				var currentArray2 = currentGraphics.getCurves();
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentCurveDrawer = currentArray2[j];
					
					var curveEndParameter = currentCurveDrawer.getProperty("endParameter");
					var fullLength = curveEndParameter.getInputProperty();
					if(fullLength === null) {
						fullLength = curveEndParameter.getValue();
					}
					
					var startMultiplier = MultiplicationNode.create(aStartParameter, fullLength);
					var endMultiplier = MultiplicationNode.create(aEndParameter, fullLength);
					var loopEndMultiplier = MultiplicationNode.create(aLoopEndParameter, fullLength);
					
					currentCurveDrawer.getProperty("startParameter").connectInput(startMultiplier.getProperty("outputValue"));
					currentCurveDrawer.getProperty("endParameter").disconnectInput().connectInput(endMultiplier.getProperty("outputValue"));
					
					var loopCurveDrawer = CurveDrawer2d.create(currentCurveDrawer.getProperty("curve"), 0, loopEndMultiplier.getProperty("outputValue"));
					currentGraphics.addCurve(loopCurveDrawer);
				}
			}
		}
	};
	
	objectFunctions.drawVectorLayer = function(aAsset, aLayerName, aParentLayer, aHolderWidth, aHolderHeight) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::drawVectorLayer");
		//console.log(aAsset, aLayerName, aParentLayer);
		
		if(aAsset.getStatus() === AssetStatusTypes.LOADED) {
			this._performDrawVectorLayer(aAsset, aLayerName, aParentLayer, aHolderWidth, aHolderHeight);
		}
		else {
			aAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._performDrawVectorLayer, [aAsset, aLayerName, aParentLayer, aHolderWidth, aHolderHeight]));
		}
	};
	
	objectFunctions._performDrawVectorLayer = function(aAsset, aLayerName, aParentLayer, aHolderWidth, aHolderHeight) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_performDrawVectorLayer");
		//console.log(aAsset, aLayerName, aParentLayer);
		
		
		//METODO: don't parse the file multiple times
		var dataName = dbm.singletons.dbmIdManager.getNewId("graphics");
		dbm.singletons.dbmDataManager.addXmlDefinition(XmlChildRetreiver.getFirstChild(aAsset.getData()), dataName);
		var parsedGraphicsData = dbm.singletons.dbmDataManager.getData(dataName).data;
		
		var documentWidth = parsedGraphicsData.metaData.getObject("width");
		var documentHeight = parsedGraphicsData.metaData.getObject("height");
		
		var isFullSize = (Math.abs(aHolderWidth-documentWidth) < 1) && (Math.abs(aHolderHeight-documentHeight) < 1)
		
		var treeStructure = parsedGraphicsData.data;
		
		if(aLayerName === "") {
			var currentArray = treeStructure.getRoot().getChildren();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this._performDrawSingleVectorLayer(currentArray[i], aParentLayer, aHolderWidth, aHolderHeight, true);
			}
		}
		else {
			var selectedLayer = DataSelector.getFirstEqualMatch(
				GetNamedArrayValueObject.createCommand(
					GetVariableObject.createCommand(
						GetVariableObject.createSelectOnBaseObjectCommand("data"),
						"metaData"
					),
					"name"
				),
				aLayerName,
				treeStructure.getRoot().getChildren()
			);
			
			if(selectedLayer !== null) {
				//METODO: check if layer width is the same as the document size
				this._performDrawSingleVectorLayer(selectedLayer, aParentLayer, aHolderWidth, aHolderHeight, isFullSize);
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_performDrawVectorLayer", "No layer matched name " +  aLayerName + ".");
			}
		}
	};
	
	objectFunctions._performDrawSingleVectorLayer = function(aLayerData, aParentLayer, aHolderWidth, aHolderHeight, aIsFullSize) {
		//console.log("com.developedbyme.projects.examples.animation.aftereffectsimport.DrawAnimationApplication::_performDrawSingleVectorLayer");
		//console.log(aLayerData, aParentLayer, aHolderWidth, aHolderHeight);
		
		var layerMetaData = aLayerData.data.metaData;
		var layerWidth = layerMetaData.getObject("width");
		var layerHeight = layerMetaData.getObject("height");
	
		var centertedLayer = aParentLayer.getChildByPath("center");
		if(!aIsFullSize) {
			centertedLayer.getProperty("x").setValue(0.5*(aHolderWidth-layerWidth));
			centertedLayer.getProperty("y").setValue(0.5*(aHolderHeight-layerHeight));
		}
		else {
			var transfomationData = aLayerData.data.data.transformation;
			centertedLayer.getProperty("x").setValue(transfomationData.x);
			centertedLayer.getProperty("y").setValue(transfomationData.y);
		}
		
		IllustratorFileGenerator.drawLayers(aLayerData.getChildren(), centertedLayer, this._canvasController);
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
			aOutputProperty.setAnimationController(aDataProperty.getAnimationController());
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
			aOutputProperty.setAnimationController(aDataProperty.getAnimationController());
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