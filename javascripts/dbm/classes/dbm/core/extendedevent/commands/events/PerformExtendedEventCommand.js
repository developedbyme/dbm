/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand");
	
	//Self reference
	var PerformExtendedEventCommand = dbm.importClass("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.eventNameReevaluator = null;
		this.dataReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theObject = this.objectReevaluator.reevaluate(aEventDataObject);
		var eventName = this.eventNameReevaluator.reevaluate(aEventDataObject);
		var data = this.dataReevaluator.reevaluate(aEventDataObject);
		
		theObject.getExtendedEvent().perform(eventName, data);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("object: " + this.objectReevaluator);
		aReturnArray.push("eventName: " + this.eventNameReevaluator);
		aReturnArray.push("data: " + this.dataReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.objectReevaluator);
		ClassReference.softDestroyIfExists(this.eventNameReevaluator);
		ClassReference.softDestroyIfExists(this.dataReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.objectReevaluator = null;
		this.eventNameReevaluator = null;
		this.dataReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aObject, aEventName, aData) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.eventNameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aEventName);
		newCommand.dataReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aData);
		
		return newCommand;
	};
});