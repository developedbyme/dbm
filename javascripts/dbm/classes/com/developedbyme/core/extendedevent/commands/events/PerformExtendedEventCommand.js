dbm.registerClass("com.developedbyme.core.extendedevent.commands.events.PerformExtendedEventCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.events.PerformExtendedEventCommand");
	
	//Self reference
	var PerformExtendedEventCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.events.PerformExtendedEventCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.events.PerformExtendedEventCommand::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.eventNameReevaluator = null;
		this.dataReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.events.PerformExtendedEventCommand::perform");
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
		newCommand.dataReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aData);
		
		return newCommand;
	};
});