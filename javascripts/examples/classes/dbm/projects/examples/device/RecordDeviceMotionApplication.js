/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that records the motion of a device to animation timelines.
 */
dbm.registerClass("dbm.projects.examples.device.RecordDeviceMotionApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication");
	
	//Self reference
	var RecordDeviceMotionApplication = dbm.importClass("dbm.projects.examples.device.RecordDeviceMotionApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var DeviceMotion = dbm.importClass("dbm.utils.device.DeviceMotion");
	var DeviceOrientation = dbm.importClass("dbm.utils.device.DeviceOrientation");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	var RecordAnimationNode = dbm.importClass("dbm.flow.nodes.animation.RecordAnimationNode");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var PressButton = dbm.importClass("dbm.gui.buttons.PressButton");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var DeviceExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.DeviceExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_init");
		
		this.superCall();
		
		this._startButton = null;
		this._deviceMotion = null;
		this._deviceOrientation = null;
		this._startTimeNode = null;
		this._motionRecorders = null;
		this._orientationRecorders = null;
		
		this._updateMotionRecordingCommand = this.addDestroyableObject(CallFunctionCommand.createCommand(this, this._updateMotionRecording, []).retain());
		this._updateOrientationRecordingCommand = this.addDestroyableObject(CallFunctionCommand.createCommand(this, this._updateOrientationRecording, []).retain());
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_createPage");
		
		this._startTimeNode = this.addDestroyableObject(SubtractionNode.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0));
		this._motionRecorders = NamedArray.create(true);
		this._orientationRecorders = NamedArray.create(true);
		
		this._deviceMotion = DeviceMotion.create();
		this._deviceMotion.startUpdating();
		
		this._deviceOrientation = DeviceOrientation.create();
		this._deviceOrientation.startUpdating();
		
		this._createText("X", this._deviceMotion.getProperty("xValue"));
		this._createText("Y", this._deviceMotion.getProperty("yValue"));
		this._createText("Z", this._deviceMotion.getProperty("zValue"));
		
		this._createText("X with gravity", this._deviceMotion.getProperty("xWithGravityValue"));
		this._createText("Y with gravity", this._deviceMotion.getProperty("yWithGravityValue"));
		this._createText("Z with gravity", this._deviceMotion.getProperty("zWithGravityValue"));
		
		this._createText("Alpha", this._deviceMotion.getProperty("alphaValue"));
		this._createText("Beta", this._deviceMotion.getProperty("betaValue"));
		this._createText("Gamma", this._deviceMotion.getProperty("gammaValue"));
		
		this._createText("Interval", this._deviceMotion.getProperty("interval"));
		
		this._createText("Alpha", this._deviceOrientation.getProperty("alphaValue"));
		this._createText("Beta", this._deviceOrientation.getProperty("betaValue"));
		this._createText("Gamma", this._deviceOrientation.getProperty("gammaValue"));
		
		this._startButton = PressButton.createDiv(dbm.getDocument(), true, {"style": "width: 400px; height: 400px; background-color: #777777;"}).activate();
		this._startButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(this, this._startRecording, []));
		this._startButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE, CallFunctionCommand.createCommand(this, this._stopRecording, []));
		this._startButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, CallFunctionCommand.createCommand(this, this._stopRecording, []));
	};
	
	objectFunctions._startRecording = function() {
		console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_startRecording");
		
		this._deviceMotion.getExtendedEvent().addCommandToEvent(DeviceExtendedEventIds.MOTION_UPDATED, this._updateMotionRecordingCommand);
		this._deviceOrientation.getExtendedEvent().addCommandToEvent(DeviceExtendedEventIds.ORIENTATION_UPDATED, this._updateOrientationRecordingCommand);
		
		this._startTimeNode.getProperty("inputValue2").setValue(dbm.singletons.dbmAnimationManager.globalTimeProperty.getValue());
		console.log(this._startTimeNode);
		
		this._createMotionRecorder("x", this._deviceMotion.getProperty("xValue"));
		this._createMotionRecorder("y", this._deviceMotion.getProperty("yValue"));
		this._createMotionRecorder("z", this._deviceMotion.getProperty("zValue"));
		
		this._createOrientationRecorder("alpha", this._deviceOrientation.getProperty("alphaValue"));
		this._createOrientationRecorder("beta", this._deviceOrientation.getProperty("betaValue"));
		this._createOrientationRecorder("gamma", this._deviceOrientation.getProperty("gammaValue"));
		
		this._startButton.setStyleProperty("background-color", "#FF0000");
	};
	
	objectFunctions._stopRecording = function() {
		console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_stopRecording");
		
		this._deviceMotion.getExtendedEvent().removeCommandFromEvent(DeviceExtendedEventIds.MOTION_UPDATED, this._updateMotionRecordingCommand);
		this._deviceOrientation.getExtendedEvent().removeCommandFromEvent(DeviceExtendedEventIds.ORIENTATION_UPDATED, this._updateOrientationRecordingCommand);
		
		var saveObject = {
			"motion": {
				"x": this._getMotionTimeline("x"),
				"y": this._getMotionTimeline("y"),
				"z": this._getMotionTimeline("z")
			},
			"orientation": {
				"alpha": this._getOrientationTimeline("alpha"),
				"beta": this._getOrientationTimeline("beta"),
				"gamma": this._getOrientationTimeline("gamma")
			}
		};
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(saveObject);
		var encodedXmlString = XmlCreator.createStringFromXml(encodedXml);
		console.log(encodedXml);
		console.log(encodedXmlString);
		
		var loader = JsonAsset.create("/dbm/examples/saveFile");
		
		var currentDate = new Date();
		var dateString = IsoDate.getCompactIsoDate(currentDate);
		var dateAndTimeString = IsoDate.getCompactIsoDateAndTime(currentDate);
		loader.setupAsFormObjectPost({"fileName": "recordDeviceMotionApplication/" + dateString + "/" + dateAndTimeString + ".xml", "dataEncoding": "ascii", "data": encodedXmlString});
		
		loader.load();
		
		this._destroyMotionRecorder("x");
		this._destroyMotionRecorder("y");
		this._destroyMotionRecorder("z");
		
		this._destroyOrientationRecorder("alpha");
		this._destroyOrientationRecorder("beta");
		this._destroyOrientationRecorder("gamma");
		
		this._startButton.setStyleProperty("background-color", "#777777");
		
	};
	
	objectFunctions._createMotionRecorder = function(aName, aInputProperty) {
		//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_createMotionRecorder");
		
		var newTimeline = Timeline.create(aInputProperty.getValue());
		var newRecorder = RecordAnimationNode.create(aInputProperty, this._startTimeNode.getProperty("outputValue"), newTimeline);
		
		this._motionRecorders.addObject(aName, newRecorder);
		
		return newRecorder;
	};
	
	objectFunctions._getMotionTimeline = function(aName) {
		return this._motionRecorders.getObject(aName).getTimeline();
	};
	
	objectFunctions._destroyMotionRecorder = function(aName) {
		
		var currentRecorder = this._motionRecorders.getObject(aName);
		currentRecorder.getTimeline().destroy();
		currentRecorder.destroy();
		
		this._motionRecorders.removeObject(aName);
	};
	
	objectFunctions._createOrientationRecorder = function(aName, aInputProperty) {
		//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_createOrientationRecorder");
		
		var newTimeline = Timeline.create(aInputProperty.getValue());
		var newRecorder = RecordAnimationNode.create(aInputProperty, this._startTimeNode.getProperty("outputValue"), newTimeline);
		
		this._orientationRecorders.addObject(aName, newRecorder);
		
		return newRecorder;
	};
	
	objectFunctions._getOrientationTimeline = function(aName) {
		return this._orientationRecorders.getObject(aName).getTimeline();
	};
	
	objectFunctions._destroyOrientationRecorder = function(aName) {
		
		var currentRecorder = this._orientationRecorders.getObject(aName);
		currentRecorder.getTimeline().destroy();
		currentRecorder.destroy();
		
		this._orientationRecorders.removeObject(aName);
	};
	
	objectFunctions._updateMotionRecording = function() {
		//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_updateMotionRecording");
		
		var currentArray = this._motionRecorders.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentRecorder = currentArray[i];
			currentRecorder.getProperty("update").update();
		}
	};
	
	objectFunctions._updateOrientationRecording = function() {
		//console.log("dbm.projects.examples.device.RecordDeviceMotionApplication::_updateOrientationRecording");
		
		var currentArray = this._orientationRecorders.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentRecorder = currentArray[i];
			currentRecorder.getProperty("update").update();
		}
	};
	
	objectFunctions._createText = function(aLabel, aProperty) {
		var body = dbm.getDocument().body;
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var holder = htmlCreator.createDiv(null, htmlCreator.createText(aLabel + ": "));
		body.appendChild(holder);
		var printText = TextElement.create(holder, true, aProperty);
		printText.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});