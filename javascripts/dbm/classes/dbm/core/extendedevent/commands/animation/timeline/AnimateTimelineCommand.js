/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.animation.timeline.AnimateTimelineCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.animation.timeline.AnimateTimelineCommand");
	
	var AnimateTimelineCommand = dbm.importClass("dbm.core.extendedevent.commands.animation.timeline.AnimateTimelineCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.animation.timeline.AnimateTimelineCommand::_init");
		
		this.superCall();
		
		this.timelineReevaluator = null;
		this.valueReevaluator = null;
		this.timeReevaluator = null;
		this.easingReevaluator = null;
		this.delayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.animation.timeline.AnimateTimelineCommand::perform");
		//console.log(aEventDataObject);
		
		var timeline = this.timelineReevaluator.reevaluate(aEventDataObject);
		var theValue = this.valueReevaluator.reevaluate(aEventDataObject);
		var theTime = this.timeReevaluator.reevaluate(aEventDataObject);
		var theEasing = this.easingReevaluator.reevaluate(aEventDataObject);
		var theDelay = this.delayReevaluator.reevaluate(aEventDataObject);
		
		timeline.animateValue(theValue, theTime, theEasing, theDelay);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.timelineReevaluator);
		ClassReference.softDestroyIfExists(this.valueReevaluator);
		ClassReference.softDestroyIfExists(this.timeReevaluator);
		ClassReference.softDestroyIfExists(this.easingReevaluator);
		ClassReference.softDestroyIfExists(this.delayReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.timelineReevaluator = null;
		this.valueReevaluator = null;
		this.timeReevaluator = null;
		this.easingReevaluator = null;
		this.delayReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates an animation on a timeline
	 * 
	 * @param	aTimeline	The timline to animate on.
	 * @param	aValue		The value to animate to.
	 * @param	aTime		The time to animate.
	 * @param	aEasing		The easing function to use.
	 * @apram	aDelay		The delay before the animation starts
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aTimeline, aValue, aTime, aEasing, aDelay) {
		var newCommand = (new AnimateTimelineCommand()).init();
		
		if(!VariableAliases.isSet(aTimeline)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[AnimateTimelineCommand]", "createCommand", "Timeline is null");
			return null;
		}
		
		newCommand.timelineReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTimeline);
		newCommand.valueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aValue);
		newCommand.timeReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTime);
		newCommand.easingReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aEasing);
		newCommand.delayReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aDelay);
		
		return newCommand;
	};
});