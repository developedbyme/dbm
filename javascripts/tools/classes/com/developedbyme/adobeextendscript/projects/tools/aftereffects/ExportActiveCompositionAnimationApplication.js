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
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var SpatialCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	
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
			}
			compositionMetaData.data.push(layerMetaData);
			
			var timelinesArray = NamedArray.create(false);
			
			var currentAnimationProperties = currentLayer.getAnimationProperties();
			var currentArray2 = currentAnimationProperties.getNamesArray();
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentName = currentArray2[j];
				var currentProperty = currentAnimationProperties.getObject(currentName);
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
		console.log(aProperty.unitsText);
		
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
			case PropertyValueType.NO_VALUE:
			case PropertyValueType.CUSTOM_VALUE:
			case PropertyValueType.MARKER:
			case PropertyValueType.LAYER_INDEX:
			case PropertyValueType.MASK_INDEX:
			case PropertyValueType.SHAPE:
			case PropertyValueType.TEXT_DOCUMENT:
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
			
			//METODO: pass in multiplier
			if(isSpatial) {
				this.setupTimelinesForSpatialProperty(aProperty, pointProperties, returnArray);
			}
			else {
				this.setupTimelinesForProperty(aProperty, returnArray);
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
	
	objectFunctions.setupTimelinesForProperty = function(aProperty, aReturnTimelines) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setupTimelinesForProperty");
		//console.log(aProperty, aReturnTimelines);
		
		var numberOfKeys = aProperty.numKeys;
		if(numberOfKeys > 1) {
			var lastTime = aProperty.keyTime(1);
			var lastValue = aProperty.keyValue(1);
			var lastInEasing = aProperty.keyInTemporalEase(1);
			var lastOutEasing = aProperty.keyOutTemporalEase(1);
			if(aReturnTimelines.length === 1) {
				aReturnTimelines[0].getProperty("startValue").setValue(lastValue);
			}
			else {
				this.setStartValuesForTimelines(lastValue, aReturnTimelines);
			}
			
			for(var i = 2; i <= numberOfKeys; i++) { //MENOTE: count starts at 1, items are processed 2 by 2
				var currentTime = aProperty.keyTime(i);
				var currentValue = aProperty.keyValue(i);
				var currentInEasing = aProperty.keyInTemporalEase(i);
				var currentOutEasing = aProperty.keyOutTemporalEase(i);
				
				this.addPartToTimelines(lastTime, lastValue, lastInEasing, lastOutEasing, currentTime, currentValue, currentInEasing, currentOutEasing, aReturnTimelines);
				
				lastTime =  currentTime;
				lastValue = currentValue;
				lastInEasing = currentInEasing;
				lastOutEasing = currentOutEasing;
			}
		}
		else {
			if(aReturnTimelines.length === 1) {
				aReturnTimelines[0].getProperty("startValue").setValue(aProperty.value);
			}
			else {
				this.setStartValuesForTimelines(aProperty.value, aReturnTimelines);
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
			var lastInEasing = aProperty.keyInTemporalEase(1);
			var lastOutEasing = aProperty.keyOutTemporalEase(1);
			var lastInTangent = aProperty.keyInSpatialTangent(1);
			var lastOutTangent = aProperty.keyOutSpatialTangent(1);
			this.setStartValuesForTimelines(lastValue, aReturnTimelines);
			for(var i = 2; i <= numberOfKeys; i++) { //MENOTE: count starts at 1, items are processed 2 by 2
				//console.log(">>>>>>>", i);
				var currentTime = aProperty.keyTime(i);
				var currentValue = aProperty.keyValue(i);
				var currentInEasing = aProperty.keyInTemporalEase(i);
				var currentOutEasing = aProperty.keyOutTemporalEase(i);
				var currentInTangent = aProperty.keyInSpatialTangent(i);
				var currentOutTangent = aProperty.keyOutSpatialTangent(i);
				
				var spatialCurve = BezierCurve.createWithLength(3, true, 4);
				this._fillSpacialCurveWithValues(lastValue, lastOutTangent, currentValue, currentInTangent, spatialCurve.pointsArray);
				//METODO: check taht it's actually moving
				
				this.addSpatialPartToTimelines(lastTime, lastValue, lastInEasing, lastOutEasing, currentTime, currentValue, currentInEasing, currentOutEasing, spatialCurve, aPointProperties, aReturnTimelines);
				
				lastTime =  currentTime;
				lastValue = currentValue;
				lastInEasing = currentInEasing;
				lastOutEasing = currentOutEasing;
				lastInTangent = currentInTangent;
				lastOutTangent = currentOutTangent;
			}
		}
		else {
			this.setStartValuesForTimelines(aProperty.value, aReturnTimelines);
		}
	};
	
	objectFunctions.addPartToTimelines = function(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aReturnTimelines) {
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
				startValue = aStartValues;
				endValue = aEndValues;
			}
			else {
				startValue = aStartValues[i];
				endValue = aEndValues[i];
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
					startInfluence, startValue+startInfluence*duration*aStartOutEasing[i].speed,
					endInfluence, endValue-(1-endInfluence)*duration*aEndInEasing[i].speed,
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
	
	objectFunctions.addSpatialPartToTimelines = function(aStartTime, aStartValues, aStartInEasing, aStartOutEasing, aEndTime, aEndValues, aEndInEasing, aEndOutEasing, aSpatialCurve, aPointProperties, aReturnTimelines) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::addSpatialPartToTimelines");
		//console.log(aStartTime, aStartValues, aStartInTangents, aStartOutTangents, aEndTime, aEndValues, aEndInTangents, aEndOutTangents, aReturnTimelines);
		
		var isLinear = false; //METODO: find out if it's linear
		
		var currentArray = aReturnTimelines;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var newPart = null;
			//METODO: temporal ease
			if(isLinear) {
				newPart = InterpolationTimelinePart.create(aStartValues[i], aEndValues[i], dbm.singletons.dbmAnimationMananger.getInterpolationObject(InterpolationTypes.LINEAR), aStartTime, aEndTime-aStartTime);
			}
			else {
				//var curvePoints = [0, 0, 1/3, 1/3, 2/3, 2/3, 1, 1];
				newPart = SpatialCurveTimelinePart.create(aSpatialCurve, aStartTime, aEndTime-aStartTime);
				newPart.pointProperty = aPointProperties[i];
			}
			
			currentArray[i].addPart(newPart);
		}
	};
	
	objectFunctions.setStartValuesForTimelines = function(aValues, aReturnTimelines) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::setStartValuesForTimelines");
		//console.log(aValues, aReturnTimelines);
		
		var currentArray = aValues;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTimeline = aReturnTimelines[i];
			currentTimeline.getProperty("startValue").setValue(currentArray[i]);
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