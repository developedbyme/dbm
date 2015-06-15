/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var TimeZone = dbm.importClass("TimeZone");
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var OneTouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.OneTouchOrMouseDetector");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var GlobalTimeNode = dbm.importClass("dbm.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("dbm.flow.nodes.math.DivisionNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	var DateStringToTimeNode = dbm.importClass("dbm.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("dbm.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("dbm.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("dbm.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("dbm.flow.nodes.text.TextReplacementNode");
	var ReportNode = dbm.importClass("dbm.flow.nodes.debug.ReportNode");
	var ValuesFromRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var PositionRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.PositionRectangleNode");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var FlowAnalyzeFunctions = dbm.importClass("dbm.flow.analyze.FlowAnalyzeFunctions");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var FlowUpdateChainCreator = dbm.importClass("dbm.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._timeZonesPath = "assets/timeZones.xml#timeZones";
		this._prePrepareSoundPath = "assets/sounds/beep-8.mp3";
		this._prepareSoundPath = "assets/sounds/beep-6.mp3";
		this._normalSoundPath = "assets/sounds/beep-1.mp3";
		this._failSoundPath = "assets/sounds/beep-5.mp3";
		this._hornSoundPath = "assets/sounds/caddy-horn.mp3";
		
		//METODO: fix sound loader , this._prePrepareSoundPath, this._prepareSoundPath, this._normalSoundPath, this._failSoundPath, this._hornSoundPath
		this._assetsLoader.addAssetsByPath(this._timeZonesPath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		this.getExtendedEvent().linkJavascriptEvent(dbm.getDocument().body, JavascriptEventIds.KEY_DOWN, JavascriptEventIds.KEY_DOWN, JavascriptEventIds.KEY_DOWN, true, true).activate();
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.KEY_DOWN, CallFunctionCommand.createCommand(this, this._callback_keyPressed, [GetVariableObject.createSelectDataCommand()]))
		
		this._nextPlayTimes = new Array();
		this._nextBeepEffects = new Array();
		this._sounds = NamedArray.create(false);
		
		this._currentIndex = this.createProperty("currentIndex", -1);
		this._currentIndexAnimation = this.createGhostProperty("currentIndexAnimation");
		this._currentAnimationIndex = this.createProperty("currentAnimationIndex", -1);
		this._currentAnimationIndex.createTimelineControl();
		this._currentIndexWithOverride = this.createProperty("currentIndexWithOverride", -1);
		this._keyOverrideValue = this.createProperty("keyOverrideValue", 0);
		this._keyOverrideValue.createTimelineControl();
		this._timeZones = ArrayHolder.create(true);
		this.addDestroyableObject(this._timeZones);
		this._numberOfTimeZones = this.createProperty("numberOfTimeZones", 0);
		
		var indexWithOverrideNode = AdditionNode.create(this._currentAnimationIndex, this._keyOverrideValue);
		this._currentIndexWithOverride.connectInput(indexWithOverrideNode.getProperty("outputValue"));
		
		this._windowSizeNode = (new WindowSizeNode()).init();
		this._windowSizeNode.start();
		this._currentDateNode = CurrentTimeNode.create();
		this._currentDateNode.start();
		
		//Timezone animations
		this._timeZonePositionTimeline = Timeline.create(1);
		this._timeZonePositionTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, -0.75);
		this._timeZonePositionTimeline.animateValueAt(-1, 0.75, InterpolationTypes.QUADRATIC, 0);
		
		this._timeZoneScaleTimeline = Timeline.create(0);
		this._timeZoneScaleTimeline.animateValueAt(0.10, 0.5, InterpolationTypes.INVERTED_QUADRATIC, -1.5);
		this._timeZoneScaleTimeline.animateValueAt(1, 0.75, InterpolationTypes.QUADRATIC, -0.75);
		this._timeZoneScaleTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		this._timeZoneInDomTimeline = Timeline.create(false);
		this._timeZoneInDomTimeline.setValueAt(true, -1.5);
		this._timeZoneInDomTimeline.setValueAt(false, 0.75);
		
		//Debug driver
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		this._mouseRangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, this._windowSizeNode.getProperty("width"), 0, this._numberOfTimeZones);
		
		//Scale group
		this._scalePoint = FlowGroup.create({x: this._windowSizeNode.getProperty("width"), y: this._windowSizeNode.getProperty("height"), scale: 0.5, moveLengthScale: 0.4, maxWidthScale: 0.8}, {x: 0, y: 0, moveLength: 0, maxWidth: 0, halfMaxWidth: 0});
		
		var scaleXNode = MultiplicationNode.create(this._scalePoint.getInputProperty("x"), this._scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(this._scalePoint.getInputProperty("y"), this._scalePoint.getInputProperty("scale"));
		
		var scaleLengthNode = MultiplicationNode.create(this._scalePoint.getInputProperty("y"), this._scalePoint.getInputProperty("moveLengthScale"));
		var scaleMaxWidthNode = MultiplicationNode.create(this._scalePoint.getInputProperty("x"), this._scalePoint.getInputProperty("maxWidthScale"));
		var halfMaxWidthNode = MultiplicationNode.create(scaleMaxWidthNode.getProperty("outputValue"), 0.5);
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), this._scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), this._scalePoint.getOutputProperty("y"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleLengthNode.getProperty("outputValue"), this._scalePoint.getOutputProperty("moveLength"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleMaxWidthNode.getProperty("outputValue"), this._scalePoint.getOutputProperty("maxWidth"));
		dbm.singletons.dbmFlowManager.connectProperties(halfMaxWidthNode.getProperty("outputValue"), this._scalePoint.getOutputProperty("halfMaxWidth"));
		
		this.createUpdateFunction("updateCurrentIndex", this._updateCurrentIndexFlow, [this._currentDateNode.getProperty("time")], [this._currentIndex]);
		this.createUpdateFunction("updateCurrentIndexAniamtion", this._updateCurrentIndexAnimationFlow, [this._currentIndex], [this._currentIndexAnimation]);
		
		//Parse data
		this.parseTimeZoneXml(dbm.singletons.dbmAssetRepository.getAssetData(this._timeZonesPath));
		
		this.addSound("pre-prepare", this._prePrepareSoundPath);
		this.addSound("prepare", this._prepareSoundPath);
		this.addSound("normal", this._normalSoundPath);
		this.addSound("fail", this._failSoundPath);
		this.addSound("horn", this._hornSoundPath);
		
		this._currentIndexAnimation.startUpdating();
	};
	
	objectFunctions._updateCurrentIndexFlow = function(aFlowUpdateNumber) {
		var compareValue = this._currentDateNode.getProperty("time").getValueWithoutFlow();
		
		var nextPlayTime = this._nextPlayTimes[0]
		
		if(nextPlayTime !== -1 && compareValue >= nextPlayTime-0.75) {
			
			this._nextPlayTimes.shift();
			var nextBeepEffect = this._nextBeepEffects.shift();
			
			this.playSound(nextBeepEffect);
		}
		
		var currentArray = this._timeZones.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTimeZone = currentArray[i];
			if(compareValue < currentTimeZone.getCompareTime()) {
				this._currentIndex.setValueWithFlow(i, aFlowUpdateNumber);
				return;
			}
		}
		
		this._currentIndex.setValueWithFlow(currentArrayLength, aFlowUpdateNumber);
	};
	
	objectFunctions._updateCurrentIndexAnimationFlow = function(aFlowUpdateNumber) {
		var currentValue = this._currentIndex.getValueWithoutFlow();
		
		var currentTimeZone = this._timeZones.array[currentValue];
		if(currentTimeZone !== null) {
			this._nextPlayTimes.push(currentTimeZone.getCompareTime()-20);
			this._nextPlayTimes.push(currentTimeZone.getCompareTime()-10);
			this._nextPlayTimes.push(currentTimeZone.getCompareTime()-3);
			this._nextPlayTimes.push(currentTimeZone.getCompareTime()-2);
			this._nextPlayTimes.push(currentTimeZone.getCompareTime()-1);
			this._nextPlayTimes.push(currentTimeZone.getCompareTime());
			
			this._nextBeepEffects.push("pre-prepare");
			this._nextBeepEffects.push("pre-prepare");
			this._nextBeepEffects.push("prepare");
			this._nextBeepEffects.push("prepare");
			this._nextBeepEffects.push("prepare");
			this._nextBeepEffects.push(currentTimeZone.soundId);
		}
		
		this._currentAnimationIndex.animateValue(currentValue, 0.8, InterpolationTypes.INVERTED_QUADRATIC, 0);
	};
	
	objectFunctions._insertTimeZone = function(aTimeZone) {
		
		var compareValue = aTimeZone.getCompareTime();
		
		var currentArray = this._timeZones.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTimeZone = currentArray[i];
			if(compareValue < currentTimeZone.getCompareTime()) {
				currentArray.splice(i, 0, aTimeZone);
				aTimeZone.setIndex(i);
				return i;
			}
		}
		
		var newIndex = currentArray.length;
		currentArray.push(aTimeZone);
		aTimeZone.setIndex(newIndex);
		
		return newIndex;
	};
	
	objectFunctions._createTimeZone = function(aName, aTimeString, aSoundId) {
		
		var newTimeZone = TimeZone.create(aName, aTimeString, this._currentDateNode, this._scalePoint);
		newTimeZone.soundId = aSoundId;
		
		newTimeZone.setPropertyInput("centerX", this._scalePoint.getOutputProperty("x"));
		newTimeZone.setPropertyInput("centerY", this._scalePoint.getOutputProperty("y"));
		newTimeZone.setPropertyInput("moveLength", this._scalePoint.getOutputProperty("moveLength"));
		newTimeZone.setPropertyInput("maxWidth", this._scalePoint.getOutputProperty("maxWidth"));
		newTimeZone.setPropertyInput("halfMaxWidth", this._scalePoint.getOutputProperty("halfMaxWidth"));
		newTimeZone.setPropertyInput("currentDate", this._currentDateNode.getProperty("time"));
		
		newTimeZone.setPropertyInput("selectedIndex", this._currentIndexWithOverride);
		
		newTimeZone.setPropertyInput("positionTimeline", this._timeZonePositionTimeline);
		newTimeZone.setPropertyInput("scaleTimeline", this._timeZoneScaleTimeline);
		newTimeZone.setPropertyInput("inDomTimeline", this._timeZoneInDomTimeline);
		
		return newTimeZone;
		
	};
	
	objectFunctions.addTimeZone = function(aName, aTimeString, aSoundId) {
		var newTimeZone = this._createTimeZone(aName, aTimeString, aSoundId);
		var insertedIndex = this._insertTimeZone(newTimeZone);
		
		//METODO: animate initial scale
		
		var currentArray = this._timeZones.array;
		var currentArrayLength = currentArray.length;
		for(var i = insertedIndex+1; i < currentArrayLength; i++) {
			var currentTimeZone = currentArray[i];
			currentTimeZone.changeIndex(i);
		}
		
		this._numberOfTimeZones.setValue(currentArrayLength);
	};
	
	objectFunctions._addInitialTimeZone = function(aName, aTimeString, aSoundId) {
		var newTimeZone = this._createTimeZone(aName, aTimeString, aSoundId);
		var insertedIndex = this._insertTimeZone(newTimeZone);
		
		var currentArray = this._timeZones.array;
		var currentArrayLength = currentArray.length;
		for(var i = insertedIndex+1; i < currentArrayLength; i++) {
			var currentTimeZone = currentArray[i];
			currentTimeZone.setIndex(i);
		}
	};
	
	objectFunctions.parseTimeZoneXml = function(aXml) {
		var currentArray = XmlChildRetreiver.getChilds(aXml, "data");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNode = currentArray[i];
			var currentName = XmlChildRetreiver.getAttribute(currentNode, "name");
			var currentDate = XmlChildRetreiver.getAttribute(currentNode, "date");
			var soundId = XmlChildRetreiver.getAttribute(currentNode, "soundId");
			
			this._addInitialTimeZone(currentName, currentDate, soundId);
		}
		
		this._numberOfTimeZones.setValue(currentArrayLength);
	};
	
	objectFunctions.addSound = function(aId, aPath) {
		this._sounds.addObject(aId, aPath);
	};
	
	objectFunctions.playSound = function(aId) {
		if(this._sounds.select(aId)) {
			dbm.singletons.dbmAudioManager.playAudio(this._sounds.currentSelectedItem);
		}
	};
	
	objectFunctions._callback_keyPressed = function(aEvent) {
		//console.log("Application::_callback_keyPressed");
		//console.log(aEvent);
		
		if(aEvent.keyCode === 38) { //Up
			var currentValue = this._keyOverrideValue.getValue();
			var newValue = Math.round(currentValue-1);
			this._keyOverrideValue.animateValue(newValue, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
			this._keyOverrideValue.animateValue(0, 1, InterpolationTypes.INVERTED_QUADRATIC, 5);
		}
		else if(aEvent.keyCode === 40) { //Down
			var currentValue = this._keyOverrideValue.getValue();
			var newValue = Math.round(currentValue+1);
			this._keyOverrideValue.animateValue(newValue, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
			this._keyOverrideValue.animateValue(0, 1, InterpolationTypes.INVERTED_QUADRATIC, 5);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._currentIndex = null;
		
		this.superCall();
	};
});