dbm.registerClass("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController");
	//"use strict";
	
	var HappyNewYearController = dbm.importClass("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var HappyNewYearTimeZone = dbm.importClass("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone");
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var OneTouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var ValuesFromRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var PositionRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.PositionRectangleNode");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController::_init");
		
		this.superCall();
		
		//this._touchDetector = OneTouchOrMouseDetector.create(document.body);
		//this._touchDetector.activate();
		
		this.getExtendedEvent().linkJavascriptEvent(document.body, JavascriptEventIds.KEY_DOWN, JavascriptEventIds.KEY_DOWN, JavascriptEventIds.KEY_DOWN, true, true).activate();
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.KEY_DOWN, CallFunctionCommand.createCommand(this, this._callback_keyPressed, [GetVariableObject.createSelectDataCommand()]))
		
		this._nextPlayTimes = new Array();
		this._nextBeepEffects = new Array();
		this._sounds = NamedArray.create(false);
		
		this._currentIndex = this.createProperty("currentIndex", -1);
		this._currentIndexAnimation = this.createGhostProperty("currentIndexAnimation");
		this._currentAnimationIndex = this.createProperty("currentAnimationIndex", -1);
		this._currentIndexWithOverride = this.createProperty("currentIndexWithOverride", -1);
		this._keyOverrideValue = this.createProperty("keyOverrideValue", 0);
		this._timeZones = ArrayHolder.create(true);
		this.addDestroyableObject(this._timeZones);
		this._numberOfTimeZones = this.createProperty("numberOfTimeZones", 0);
		
		var indexWithOverrideNode = AdditionNode.create(this._currentAnimationIndex, this._keyOverrideValue);
		this._currentIndexWithOverride.connectInput(indexWithOverrideNode.getProperty("outputValue"));
		
		this._windowSizeNode = (new WindowSizeNode()).init();
		this._windowSizeNode.start();
		this._currentDateNode = CurrentTimeNode.create();
		this._currentDateNode.start();
		
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
		
		this._currentIndexAnimation.startUpdating();
		
		return this;
	};
	
	objectFunctions._updateCurrentIndexFlow = function(aFlowUpdateNumber) {
		var compareValue = this._currentDateNode.getProperty("time").getValueWithoutFlow();
		
		var nextPlayTime = this._nextPlayTimes[0]
		
		if(nextPlayTime != -1 && compareValue >= nextPlayTime-0.75) {
			
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
		if(currentTimeZone != null) {
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
		
		var newTimeZone = HappyNewYearTimeZone.create(aName, aTimeString, this._currentDateNode, this._scalePoint);
		newTimeZone.soundId = aSoundId;
		
		newTimeZone.setPropertyInput("centerX", this._scalePoint.getOutputProperty("x"));
		newTimeZone.setPropertyInput("centerY", this._scalePoint.getOutputProperty("y"));
		newTimeZone.setPropertyInput("moveLength", this._scalePoint.getOutputProperty("moveLength"));
		newTimeZone.setPropertyInput("maxWidth", this._scalePoint.getOutputProperty("maxWidth"));
		newTimeZone.setPropertyInput("halfMaxWidth", this._scalePoint.getOutputProperty("halfMaxWidth"));
		newTimeZone.setPropertyInput("currentDate", this._currentDateNode.getProperty("time"));
		
		newTimeZone.setPropertyInput("selectedIndex", this._currentIndexWithOverride);
		
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
		//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController::_callback_keyPressed");
		//console.log(aEvent);
		
		if(aEvent.keyCode == 38) { //Up
			var currentValue = this._keyOverrideValue.getValue();
			var newValue = Math.round(currentValue-1);
			this._keyOverrideValue.animateValue(newValue, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
			this._keyOverrideValue.animateValue(0, 1, InterpolationTypes.INVERTED_QUADRATIC, 5);
		}
		else if(aEvent.keyCode == 40) { //Down
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
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearController::create");
		//console.log(aElement);
		
		var newNode = (new ClassReference()).init();
		
		return newNode;
	};
});