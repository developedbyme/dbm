dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.AnimationManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager");
	
	var AnimationManager = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.AnimationManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var TemporaryTimelineHolder = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder");
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var PlaybackNode = dbm.importClass("com.developedbyme.flow.nodes.time.PlaybackNode");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	dbm.setClassAsSingleton("dbmAnimationManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::_init");
		
		this.superCall();
		
		this._globalTimeNode = null;
		this._playbackNode = null;
		
		this.globalTimeProperty = null;
		this._isRecording = false;
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
	
	objectFunctions.isRecording = function() {
		return this._isRecording;
	};
	
	objectFunctions.setupDefaultPlayback = function() {
		this._globalTimeNode = GlobalTimeNode.create();
		this._globalTimeNode.start();
		
		this._playbackNode = PlaybackNode.create();
		this._playbackNode.setPropertyInput("inputTime", this._globalTimeNode.getProperty("time"));
		
		this.globalTimeProperty = this._playbackNode.getProperty("outputTime");
	};
	
	objectFunctions.addInterpolationObject = function(aType, aObject) {
		this._interpolationObjects.addObject(aType, aObject);
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
		if(slashPostion != -1) {
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
	
	objectFunctions.startRecording = function() {
		this._isRecording = true;
	};
	
	objectFunctions.stopRecording = function() {
		this._isRecording = false;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::updateTime");
		
	};
	
	objectFunctions.createTimeline = function(aStartValue, aConnectedOutput) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::createTimeline");
		var newTimeline = Timeline.create(aStartValue);
		dbm.singletons.dbmFlowManager.connectProperties(this.globalTimeProperty, newTimeline.getProperty("time"));
		if(aConnectedOutput != undefined && aConnectedOutput != null) {
			//console.log(newTimeline.getProperty("outputValue"), aConnectedOutput);
			dbm.singletons.dbmFlowManager.connectProperties(newTimeline.getProperty("outputValue"), aConnectedOutput);
			aConnectedOutput._animationController = newTimeline;
			//METODO: set this object as controller for property
		}
		return newTimeline;
	};
	
	objectFunctions.connectGlobalTimeToTimeline = function(aTimeline) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::connectGlobalTimeToTimeline");
		aTimeline.getProperty("inputTime").connectInput(this._globalTimeNode.getProperty("time"));
		return aTimeline;
	};
	
	objectFunctions._getTemporaryTimelineHolder = function(aObject) {
		var currentArray = this._temporaryTimelines;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHolder = currentArray[i];
			if(currentHolder.theObject = aObject) {
				return currentHolder;
			}
		}
		var newTemporaryTimelineHolder = TemporaryTimelineHolder.create(aObject);
		this._temporaryTimelines.push(newTemporaryTimelineHolder);
		return newTemporaryTimelineHolder;
	};
	
	objectFunctions.setVariable = function(aObject, aVariable, aValue, aDelay) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::setVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aObject);
		temporaryTimelineHolder.getProperty(aVariable).getAnimationController().setValue(aValue, aDelay);
		
	};
	
	objectFunctions.animateVariable = function(aObject, aVariable, aValue, aTime, aInterpolation, aDelay) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::animateVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aObject);
		temporaryTimelineHolder.getProperty(aVariable).animateValue(aValue, aTime, aInterpolation, aDelay);
		
	};
	
	objectFunctions.setCssVariable = function(aHtmlElement, aVariable, aValue, aDelay) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::setCssVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aHtmlElement);
		temporaryTimelineHolder.getCssProperty(aVariable).getAnimationController().setValue(aValue, aDelay);
		
	};
	
	objectFunctions.animateCssVariable = function(aHtmlElement, aVariable, aValue, aTime, aInterpolation, aDelay) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.AnimationManager::animateCssVariable");
		
		var temporaryTimelineHolder = this._getTemporaryTimelineHolder(aHtmlElement);
		temporaryTimelineHolder.getCssProperty(aVariable).animateValue(aValue, aTime, aInterpolation, aDelay);
		
	};
	
	staticFunctions._numericGetTangent = function(aParameter) {
		var tangent = (this.interpolate(aParameter+0.01)-this.interpolate(aParameter-0.01))/0.02;
		return tangent;
	};
	
});