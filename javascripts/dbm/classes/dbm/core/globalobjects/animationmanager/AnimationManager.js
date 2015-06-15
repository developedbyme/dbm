/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Global singleton to handle animation of objects.
 */
dbm.registerClass("dbm.core.globalobjects.animationmanager.AnimationManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.AnimationManager");
	
	//Self reference
	var AnimationManager = dbm.importClass("dbm.core.globalobjects.animationmanager.AnimationManager");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	var TemporaryTimelineHolder = dbm.importClass("dbm.core.globalobjects.animationmanager.data.TemporaryTimelineHolder");
	var GlobalTimeNode = dbm.importClass("dbm.flow.nodes.time.GlobalTimeNode");
	var PlaybackNode = dbm.importClass("dbm.flow.nodes.time.PlaybackNode");
	var EvaluateTimelineNode = dbm.importClass("dbm.flow.nodes.animation.EvaluateTimelineNode");
	var EvaluateComplexTimelineNode = dbm.importClass("dbm.flow.nodes.animation.EvaluateComplexTimelineNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	
	/**
	 * Consructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::_init");
		
		this.superCall();
		
		this._globalTimeNode = null;
		this._playbackNode = null;
		
		this.globalTimeProperty = null;
		this.autoPlay = true;
		
		this._temporaryTimelines = new Array();
		
		this._interpolationObjects = (new NamedArray()).init();
		this._dynamicInterpolationCreators = (new NamedArray()).init();
		
		return this;
	};
	
	objectFunctions.getGlobalTimeNode = function() {
		return this._globalTimeNode;
	};
	
	objectFunctions.getPlaybackNode = function() {
		return this._playbackNode;
	};
	
	objectFunctions.setupDefaultPlayback = function() {
		
		this.globalTimeProperty = this.createProperty("globalTimeProperty", 0);
		
		this._globalTimeNode = GlobalTimeNode.create();
		this._globalTimeNode.start();
		
		this._playbackNode = PlaybackNode.create();
		this._playbackNode.setPropertyInput("inputTime", this._globalTimeNode.getProperty("time"));
		
		this.globalTimeProperty.connectInput(this._playbackNode.getProperty("outputTime"));
	};
	
	objectFunctions.addInterpolationObject = function(aType, aObject) {
		this._interpolationObjects.addObject(aType, aObject);
	};
	
	objectFunctions.identifyInterpolationObject = function(aObject) {
		return this._interpolationObjects.identifyObject(aObject);
	};
	
	objectFunctions.addInterpolationFunction = function(aType, aFunction) {
		var newObject = new Object();
		newObject.interpolate = aFunction;
		newObject.getTangent = ClassReference._numericGetTangent;
		
		this.addInterpolationObject(aType, newObject);
	};
	
	objectFunctions.addDynamicInterpolationCreator = function(aType, aCreator) {
		this._dynamicInterpolationCreators.addObject(aType, aCreator);
	};
	
	objectFunctions.getInterpolationObject = function(aType) {
		if(this._interpolationObjects.select(aType)) {
			return this._interpolationObjects.currentSelectedItem;
		}
		var slashPostion = aType.indexOf("/");
		if(slashPostion !== -1) {
			var creatorName = aType.substring(0, slashPostion);
			if(this._dynamicInterpolationCreators.select(creatorName)) {
				var dynamicInterpolationCreator = this._dynamicInterpolationCreators.currentSelectedItem;
				var newObject = dynamicInterpolationCreator.create(creatorName, aType.substring(slashPostion+1, aType.length));
				this.addInterpolationObject(aType, newObject);
				return newObject;
			}
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getInterpolationObject", "Interpolation for " + aType + " doesn't exist.");
		
		return null;
	};
	
	objectFunctions.start = function() {
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateTimelines");
		if(this.autoPlay) {
			this._playbackNode.play();
		}
	};
	
	objectFunctions.stop = function() {
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateTimelines");
		this._playbackNode.pause();
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::updateTime");
		
	};
	
	objectFunctions.createTimeline = function(aStartValue, aConnectedOutput) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::createTimeline");
		//console.log(aStartValue, aConnectedOutput);
		
		var newTimeline = Timeline.create(aStartValue);
		if(aConnectedOutput !== undefined && aConnectedOutput !== null) {
			//console.log(newTimeline.getProperty("outputValue"), aConnectedOutput);
			
			this.setupGlobalTimelineConnection(newTimeline, aConnectedOutput);
		}
		return newTimeline;
	};
	
	objectFunctions.setupGlobalTimelineConnection = function(aTimeline, aConnectedOutput) {
		this.setupTimelineConnection(aTimeline, this.globalTimeProperty, aConnectedOutput);
		
		return aTimeline;
	};
	
	objectFunctions.setupTimelineConnection = function(aTimeline, aConnectedInput, aConnectedOutput) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::createTimeline");
		//console.log(aTimeline, aConnectedInput, aConnectedOutput);
		
		var newEvaluator = EvaluateTimelineNode.create(aTimeline, aConnectedInput);
		aTimeline.addDestroyableObject(newEvaluator);
		aTimeline._internalFunctionality_setReferenceTime(newEvaluator.getProperty("inputValue"));
		
		aConnectedOutput.connectInput(newEvaluator.getProperty("outputValue"));
		aConnectedOutput.setAnimationController(aTimeline);
		
		return aTimeline;
	};
	
	objectFunctions.setupTimelineConnectionWithComplexValue = function(aTimeline, aConnectedInput, aConnectedOutput) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::createTimeline");
		//console.log(aTimeline, aConnectedInput, aConnectedOutput);
		
		var newEvaluator = EvaluateComplexTimelineNode.create(aTimeline, aConnectedInput);
		aTimeline.addDestroyableObject(newEvaluator);
		aTimeline._internalFunctionality_setReferenceTime(newEvaluator.getProperty("inputValue"));
		
		newEvaluator.getProperty("outputValue").setAlwaysUpdateFlow();
		aConnectedOutput.connectInput(newEvaluator.getProperty("outputValue"));
		aConnectedOutput.setAnimationController(aTimeline);
		
		return aTimeline;
	};
	
	objectFunctions._getTemporaryTimelineHolder = function(aObject) {
		var currentArray = this._temporaryTimelines;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHolder = currentArray[i];
			if(currentHolder.theObject === aObject) {
				return currentHolder;
			}
		}
		var newTemporaryTimelineHolder = TemporaryTimelineHolder.create(aObject);
		this._temporaryTimelines.push(newTemporaryTimelineHolder);
		return newTemporaryTimelineHolder;
	};
	
	objectFunctions.setVariable = function(aObject, aVariable, aValue, aDelay) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::setVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aObject);
		temporaryTimelineHolder.getProperty(aVariable).getAnimationController().setValue(aValue, aDelay);
		
	};
	
	objectFunctions.animateVariable = function(aObject, aVariable, aValue, aTime, aInterpolation, aDelay) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::animateVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aObject);
		temporaryTimelineHolder.getProperty(aVariable).animateValue(aValue, aTime, aInterpolation, aDelay);
		
	};
	
	objectFunctions.setCssVariable = function(aHtmlElement, aVariable, aValue, aDelay) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::setCssVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aHtmlElement);
		temporaryTimelineHolder.getCssProperty(aVariable).getAnimationController().setValue(aValue, aDelay);
		
	};
	
	objectFunctions.animateCssVariable = function(aHtmlElement, aVariable, aValue, aTime, aInterpolation, aDelay) {
		//console.log("dbm.core.globalobjects.animationmanager.AnimationManager::animateCssVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aHtmlElement);
		temporaryTimelineHolder.getCssProperty(aVariable).animateValue(aValue, aTime, aInterpolation, aDelay);
		
	};
	
	staticFunctions._numericGetTangent = function(aParameter) {
		var tangent = (this.interpolate(aParameter+0.01)-this.interpolate(aParameter-0.01))/0.02;
		return tangent;
	};
	
});