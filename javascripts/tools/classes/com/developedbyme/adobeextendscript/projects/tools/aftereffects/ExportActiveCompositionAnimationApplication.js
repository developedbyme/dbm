/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting the animation in the active composition.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ExportActiveCompositionAnimationApplication = dbm.importClass("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var AfterEffectsProject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var InterpolationTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var AnimationCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var FileWriter = dbm.importClass("com.developedbyme.adobeextendscript.utils.file.FileWriter");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	var ShapeCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var SpatialCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var CreateArcLengthCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateArcLengthCurveNode");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var MultiplePartsTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	
	//Utils
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_init");
		
		this.superCall();
		
		this._project = null;
		this._activeComposition = null;
		this._debugData = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_createPage");
		
		this._project = AfterEffectsProject.create();
		this._activeComposition = this._project.getActiveItem();
		
		var layers = this._activeComposition.getLayers();
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("afterEffectsComposition");
		
		var compositionMetaData = MetaDataObject.create();
		exportObject.data = compositionMetaData;
		compositionMetaData.metaData.addObject("width", this._activeComposition.getProperty("width").getValue());
		compositionMetaData.metaData.addObject("height", this._activeComposition.getProperty("height").getValue());
		compositionMetaData.metaData.addObject("duration", this._activeComposition.getProperty("duration").getValue());
		compositionMetaData.metaData.addObject("frameRate", this._activeComposition.getProperty("frameRate").getValue());
		compositionMetaData.metaData.addObject("backgroundColor", this._activeComposition.getBackgroundColor());
		compositionMetaData.data = new Array();
		
		var currentArray = layers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			currentLayer.setupAnimationProperties();
			var layerMetaData = MetaDataObject.create();
			layerMetaData.metaData.addObject("name", currentLayer.getProperty("name").getValue());
			layerMetaData.metaData.addObject("inPoint", currentLayer.getProperty("inPoint").getValue());
			layerMetaData.metaData.addObject("outPoint", currentLayer.getProperty("outPoint").getValue());
			if(currentLayer instanceof AvCompositionLayer) {
				layerMetaData.metaData.addObject("width", currentLayer.getProperty("width").getValue());
				layerMetaData.metaData.addObject("height", currentLayer.getProperty("height").getValue());
				layerMetaData.metaData.addObject("blendingMode", currentLayer.getProperty("blendingMode").getValue());
				
				if(currentLayer instanceof ShapeCompositionLayer) {
					layerMetaData.metaData.addObject("footageType", "shape");
					layerMetaData.metaData.addObject("shapes", currentLayer.getShapes());
				}
				else {
					var nativeSource = currentLayer.getSource();
					if(nativeSource instanceof FootageItem) {
						var nativeMainSource = nativeSource.mainSource;
						if(nativeMainSource instanceof SolidSource) {
							layerMetaData.metaData.addObject("footageType", "solid");
							var colorArray = nativeMainSource.color;
							layerMetaData.metaData.addObject("color", RgbaColor.create(colorArray[0], colorArray[1], colorArray[2]));
						}
						//METODO: add other types
					}
				}
				
			}
			layerMetaData.metaData.addObject("masks", currentLayer.getMasks());
			compositionMetaData.data.push(layerMetaData);
			
			var timelinesArray = NamedArray.create(false);
			
			var currentAnimationProperties = currentLayer.getAnimationProperties();
			var currentArray2 = currentAnimationProperties.getNamesArray();
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentName = currentArray2[j];
				var currentProperty = currentAnimationProperties.getObject(currentName);
				//console.log(currentName);
				this.createTimelinesForProprety(currentProperty, currentName, timelinesArray);
			}
			
			layerMetaData.data = timelinesArray;
		}
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFile = FileWriter.createWithPrompt("~/export.xml");
		if(saveFile !== null) {
			saveFile.setData(encodedXml);
			saveFile.write();
		}
		
		this._debugData = compositionMetaData;
	};
	
	objectFunctions.createTimelinesForProprety = function(aProperty, aTimelineName, aReturnArray) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::createTimelinesForProprety");
		//console.log(aProperty, aTimelineName, aReturnArray);
		//console.log(aProperty.unitsText);
		
		var namesArray = null;
		var pointProperties = null;
		var returnArray = new Array();
		var isSpatial = false;
		var dimensionLength = 0;
		var multiplier = 1;
		switch(aProperty.unitsText) {
			case "percent":
				multiplier = 0.01;
				break;
			case "degrees":
				multiplier = Math.PI/180;
				break;
			default:
				//MENOTE: do nothing
				break;
		}
		
		switch(aProperty.propertyValueType) {
			case PropertyValueType.ThreeD_SPATIAL:
				isSpatial = true;
				pointProperties = ["outputValueX", "outputValueY", "outputValueZ"];
			case PropertyValueType.ThreeD:
				dimensionLength = 3;
				namesArray = [aTimelineName + "/" + "x", aTimelineName + "/" + "y", aTimelineName + "/" + "z"];
				break;
			case PropertyValueType.TwoD_SPATIAL:
				isSpatial = true;
				pointProperties = ["outputValueX", "outputValueY"];
			case PropertyValueType.TwoD:
				dimensionLength = 2;
				namesArray = [aTimelineName + "/" + "x", aTimelineName + "/" + "y"];
				break;
			case PropertyValueType.OneD:
				dimensionLength = 1;
				namesArray = [aTimelineName];
				break;
			case PropertyValueType.COLOR:
				dimensionLength = 4;
				namesArray = [aTimelineName + "/" + "r", aTimelineName + "/" + "g", aTimelineName + "/" + "b", aTimelineName + "/" + "a"];
				break;
			case PropertyValueType.MASK_INDEX:
				dimensionLength = 1;
				namesArray = [aTimelineName];
				break;
			case PropertyValueType.SHAPE:
				var newTimeline = Timeline.create(null);
				returnArray.push(newTimeline);
				aReturnArray.addObject(aTimelineName, newTimeline);
				this.setupTimelineForShapeProperty(aProperty, newTimeline);
				break;
			case PropertyValueType.NO_VALUE:
				//MENOTE: do nothing
				break;
			case PropertyValueType.CUSTOM_VALUE:
				console.log("Custom value", aProperty);
				break;
			case PropertyValueType.MARKER:
				console.log("Marker", aProperty);
				break;
			case PropertyValueType.LAYER_INDEX:
				console.log("Layer index", aProperty);
				break;
			case PropertyValueType.TEXT_DOCUMENT:
				console.log("Text document", aProperty);
				break;
			default:
				//METODO: how to handle these
				break;
		}
		
		if(dimensionLength > 0) {
			for(var i = 0; i < dimensionLength; i++) {
				var newTimeline = Timeline.create(null);
				returnArray.push(newTimeline);
				aReturnArray.addObject(namesArray[i], newTimeline);
			}
			
			if(isSpatial) {
				this.setupTimelinesForSpatialProperty(aProperty, pointProperties, returnArray);
			}
			else {
				this.setupTimelinesForProperty(aProperty, returnArray, multiplier);
			}
		}
		
		return returnArray;
	};
	
	objectFunctions.getPropertiesForLayer = function(aLayer, aPrefix, aReturnArray) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::getPropertiesForLayer");
		var numberOfProperties = aLayer.numProperties;
		
		for(var i = 1; i <= numberOfProperties; i++) { //MENOTE: count starts at 1
			var currentProperty = aLayer.property(i);
			var currentName = StringFunctions.convertToCamelCase(currentProperty.name);
			if(currentProperty instanceof PropertyGroup) {
				this.getPropertiesForLayer(currentProperty, aPrefix + currentName + "/", aReturnArray);
			}
			else {
				//console.log(aPrefix + currentName);
				aReturnArray.addObject(aPrefix + currentName, currentProperty);
			}
		}
	};
	
	objectFunctions.setupTimelinesForProperty = function(aProperty, aReturnTimelines, aMultiplier) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setupTimelinesForProperty");
		//console.log(aProperty, aReturnTimelines);
		
		var numberOfKeys = aProperty.numKeys;
		if(numberOfKeys > 1) {
			var lastTime = aProperty.keyTime(1);
			var lastValue = aProperty.keyValue(1);
			var lastInEasing = aProperty.keyInTemporalEase(1);
			var lastOutEasing = aProperty.keyOutTemporalEase(1);
			if(aReturnTimelines.length === 1) {
				aReturnTimelines[0].getProperty("startValue").setValue(aMultiplier*lastValue);
			}
			else {
				this.setStartValuesForTimelines(lastValue, aReturnTimelines, aMultiplier);
			}
			
			for(var i = 2; i <= numberOfKeys; i++) { //MENOTE: count starts at 1, items are processed 2 by 2
				var currentTime = aProperty.keyTime(i);
				var currentValue = aProperty.keyValue(i);
				var currentInEasing = aProperty.keyInTemporalEase(i);
				var currentOutEasing = aProperty.keyOutTemporalEase(i);
				
				this.addPartToTimelines(lastTime, lastValue, lastInEasing, lastOutEasing, currentTime, currentValue, currentInEasing, currentOutEasing, aReturnTimelines, aMultiplier);
				
				lastTime =  currentTime;
				lastValue = currentValue;
				lastInEasing = currentInEasing;
				lastOutEasing = currentOutEasing;
			}
		}
		else {
			if(aReturnTimelines.length === 1) {
				aReturnTimelines[0].getProperty("startValue").setValue(aMultiplier*aProperty.value);
			}
			else {
				this.setStartValuesForTimelines(aProperty.value, aReturnTimelines, aMultiplier);
			}
		}
	};
	
	objectFunctions.setupTimelinesForSpatialProperty = function(aProperty, aPointProperties, aReturnTimelines) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setupTimelinesForSpatialProperty");
		//console.log(aProperty, aReturnTimelines);
		
		var numberOfKeys = aProperty.numKeys;
		if(numberOfKeys > 1) {
			var lastTime = aProperty.keyTime(1);
			var lastValue = aProperty.keyValue(1);
			var lastInEasing = aProperty.keyInTemporalEase(1)[0];
			var lastOutEasing = aProperty.keyOutTemporalEase(1)[0];
			var lastInInterpolationType = aProperty.keyInInterpolationType(1);
			var lastOutInterpolationType = aProperty.keyOutInterpolationType(1);
			var lastInTangent = aProperty.keyInSpatialTangent(1);
			var lastOutTangent = aProperty.keyOutSpatialTangent(1);
			this.setStartValuesForTimelines(lastValue, aReturnTimelines, 1);
			for(var i = 2; i <= numberOfKeys; i++) { //MENOTE: count starts at 1, items are processed 2 by 2
				//console.log(">>>>>>>", i);
				var currentTime = aProperty.keyTime(i);
				var currentValue = aProperty.keyValue(i);
				var currentInEasing = aProperty.keyInTemporalEase(i)[0];
				var currentOutEasing = aProperty.keyOutTemporalEase(i)[0];
				var currentInInterpolationType = aProperty.keyInInterpolationType(i);
				var currentOutInterpolationType = aProperty.keyOutInterpolationType(i);
				var currentInTangent = aProperty.keyInSpatialTangent(i);
				var currentOutTangent = aProperty.keyOutSpatialTangent(i);
				
				var spatialCurve = BezierCurve.createWithLength(3, true, 4);
				this._fillSpacialCurveWithValues(lastValue, lastOutTangent, currentValue, currentInTangent, spatialCurve.pointsArray);
				//METODO: check that it's actually moving
				
				var hasEasing = (currentInInterpolationType === KeyframeInterpolationType.BEZIER || lastOutInterpolationType === KeyframeInterpolationType.BEZIER);
				
				this.addSpatialPartToTimelines(lastTime, lastValue, lastInEasing, lastOutEasing, currentTime, currentValue, currentInEasing, currentOutEasing, spatialCurve, aPointProperties, hasEasing, aReturnTimelines);
				
				lastTime =  currentTime;
				lastValue = currentValue;
				lastInEasing = currentInEasing;
				lastOutEasing = currentOutEasing;
				lastInInterpolationType = currentInInterpolationType;
				lastOutInterpolationType = currentOutInterpolationType;
				lastInTangent = currentInTangent;
				lastOutTangent = currentOutTangent;
			}
		}
		else {
			this.setStartValuesForTimelines(aProperty.value, aReturnTimelines, 1);
		}
	};
	
	objectFunctions.setupTimelineForShapeProperty = function(aProperty, aReturnTimeline) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setupTimelineForShapeProperty");
		//console.log(aProperty, aReturnTimeline);
		
		var numberOfKeys = aProperty.numKeys;
		if(numberOfKeys > 1) {
			aReturnTimeline.getProperty("startValue").setValue(this.createCurveFromShape(aProperty.keyValue(1)));
			
			for(var i = 2; i <= numberOfKeys; i++) {
				aReturnTimeline.setValueAt(this.createCurveFromShape(aProperty.keyValue(i), aProperty.keyTime(i)));
			}
		}
		else {
			aReturnTimeline.getProperty("startValue").setValue(this.createCurveFromShape(aProperty.value));
		}
	};
	
	objectFunctions.createCurveFromShape = function(aShape) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::createCurveFromShape");
		//console.log(aShape);
		
		var currentArray = aShape.vertices;
		var inTangentsArray = aShape.inTangents;
		var outTangentsArray = aShape.outTangents;
		var currentArrayLength = currentArray.length;
		
		var numberOfPoints = 1+3*(currentArrayLength-1);
		if(aShape.closed) {
			numberOfPoints += 3;
		}
		
		var returnCurve = BezierCurve.createWithLength(3, true, numberOfPoints);
		
		var pointsArray = returnCurve.pointsArray;
		pointsArray[0].x = currentArray[0][0];
		pointsArray[0].y = currentArray[0][1];
		
		for(var i = 1; i < currentArrayLength; i++) {
			var currentPointIndex = 3*i;
			
			pointsArray[currentPointIndex].x = currentArray[i][0];
			pointsArray[currentPointIndex].y = currentArray[i][1];
			pointsArray[currentPointIndex-1].x = currentArray[i][0]+inTangentsArray[i][0];
			pointsArray[currentPointIndex-1].y = currentArray[i][1]+inTangentsArray[i][1];
			pointsArray[currentPointIndex-2].x = currentArray[i-1][0]+outTangentsArray[i-1][0];
			pointsArray[currentPointIndex-2].y = currentArray[i-1][1]+outTangentsArray[i-1][1];
		}
		
		if(aShape.closed) {
			var lastPointIndex = 3*currentArrayLength;
			
			pointsArray[lastPointIndex].x = currentArray[0][0];
			pointsArray[lastPointIndex].y = currentArray[0][1];
			
			pointsArray[lastPointIndex-1].x = currentArray[0][0]+inTangentsArray[0][0];
			pointsArray[lastPointIndex-1].y = currentArray[0][1]+inTangentsArray[0][1];
			pointsArray[lastPointIndex-2].x = currentArray[currentArrayLength-1][0]+outTangentsArray[currentArrayLength-1][0];
			pointsArray[lastPointIndex-2].y = currentArray[currentArrayLength-1][1]+outTangentsArray[currentArrayLength-1][1];
		}
		
		return returnCurve;
	}
	
	objectFunctions.addPartToTimelines = function(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aReturnTimelines, aMultiplier) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::addPartToTimelines");
		//console.log(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aReturnTimelines);
		
		var currentArray = aReturnTimelines;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			//METODO: ignore some values
			//if(aStartValues[i] === aEndValues[i] && aStartOutTangents[i] === 0 && aEndInTangents[i] === 0) {
			//	continue;
			//}
			
			var startValue;
			var endValue;
			if(currentArrayLength === 1) {
				startValue = aMultiplier*aStartValues;
				endValue = aMultiplier*aEndValues;
			}
			else {
				startValue = aMultiplier*aStartValues[i];
				endValue = aMultiplier*aEndValues[i];
			}
			
			var isLinear = false; //METODO: find out if it's linear
			var newPart = null;
			if(isLinear) {
				newPart = InterpolationTimelinePart.create(startValue, endValue, dbm.singletons.dbmAnimationMananger.getInterpolationObject(InterpolationTypes.LINEAR), aStartTime, aEndTime-aStartTime);
			}
			else {
				var startInfluence = aStartOutEasing[i].influence/100;
				var endInfluence = 1-(aEndInEasing[i].influence/100);
				
				var duration = aEndTime-aStartTime;
				
				var curvePoints = [
					0, startValue,
					startInfluence, startValue+aMultiplier*startInfluence*duration*aStartOutEasing[i].speed,
					endInfluence, endValue-aMultiplier*(1-endInfluence)*duration*aEndInEasing[i].speed,
					1, endValue
				];
				
				if(curvePoints[1] === curvePoints[3] && curvePoints[1] === curvePoints[5] && curvePoints[1] === curvePoints[7]) {
					continue;
				}
				newPart = AnimationCurveTimelinePart.create(dbm.singletons.dbmCurveCreator.createCurveFromValuesArray(3, true, curvePoints), aStartTime, duration);
			}
			
			currentArray[i].addPart(newPart);
		}
	};
	
	objectFunctions.addSpatialPartToTimelines = function(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aSpatialCurve, aPointProperties, aHasEasing, aReturnTimelines) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::addSpatialPartToTimelines");
		//console.log(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aSpatialCurve, aPointProperties, aHasEasing, aReturnTimelines);
		
		var isLinear = false; //METODO: find out if it's linear
		var easingPart = null;
		
		var duration = aEndTime-aStartTime;
		
		if(aHasEasing) {
			
			var createArcLengthCurve = CreateArcLengthCurveNode.create(aSpatialCurve, 0, 1, 0.01);
			var arcLengthsCurve = createArcLengthCurve.getProperty("outputCurve").getValue();
			var tempPoint = Point.create();
			arcLengthsCurve.getPointOnCurve(arcLengthsCurve.getMaxParameter(), tempPoint);
			var arcLength = tempPoint.y;
			var linearSpeed = arcLength/duration;
			
			var speedMultiplier = 1/linearSpeed;
			
			var startInfluence = 0.01*aStartOutEasing.influence;
			var endInfluence = 0.01*aEndInEasing.influence;
			
			var startSpeed = speedMultiplier*aStartOutEasing.speed;
			var endSpeed = speedMultiplier*aEndInEasing.speed;
			
			var startValue = startSpeed*startInfluence;
			var endValue = endSpeed*endInfluence
			
			if(startValue > 1) {
				startInfluence /= startValue;
				startValue = 1;
			}
			if(endValue > 1) {
				endInfluence /= endValue;
				endValue = 1;
			}
			
			var curvePoints = [
				0, 0,
				startInfluence, startValue,
				1-endInfluence, 1-endValue,
				1, 1
			];
			
			easingPart = AnimationCurveTimelinePart.create(dbm.singletons.dbmCurveCreator.createCurveFromValuesArray(3, true, curvePoints), aStartTime, duration);
		};
		
		var currentArray = aReturnTimelines;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var newPart = null;
			
			if(isLinear) {
				newPart = InterpolationTimelinePart.create(aStartValues[i], aEndValues[i], dbm.singletons.dbmAnimationMananger.getInterpolationObject(InterpolationTypes.LINEAR), aStartTime, duration);
			}
			else {
				newPart = SpatialCurveTimelinePart.create(aSpatialCurve, aStartTime, duration);
				newPart.pointProperty = aPointProperties[i];
				
			}
			
			if(aHasEasing) {
				var curvePart = newPart;
				
				newPart = MultiplePartsTimelinePart.create([easingPart, curvePart], aStartTime, duration);
			}
			
			currentArray[i].addPart(newPart);
		}
	};
	
	objectFunctions.setStartValuesForTimelines = function(aValues, aReturnTimelines, aMultiplier) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setStartValuesForTimelines");
		//console.log(aValues, aReturnTimelines);
		
		var currentArray = aValues;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTimeline = aReturnTimelines[i];
			currentTimeline.getProperty("startValue").setValue(aMultiplier*currentArray[i]);
		}
	};
	
	objectFunctions._fillSpacialCurveWithValues = function(aStartPoint, aStartTangent, aEndPoint, aEndTangent, aPointsArray) {
		aPointsArray[0].setValues(aStartPoint[0], aStartPoint[1], aStartPoint[2]);
		aPointsArray[1].setValues(aStartPoint[0]+aStartTangent[0], aStartPoint[1]+aStartTangent[1], aStartPoint[2]+aStartTangent[2]);
		aPointsArray[2].setValues(aEndPoint[0]+aEndTangent[0], aEndPoint[1]+aEndTangent[1], aEndPoint[2]+aEndTangent[2]);
		aPointsArray[3].setValues(aEndPoint[0], aEndPoint[1], aEndPoint[2]);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});