/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.native.StopPropagationCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.native.StopPropagationCommand");
	
	var StopPropagationCommand = dbm.importClass("dbm.core.extendedevent.commands.native.StopPropagationCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.native.StopPropagationCommand::_init");
		
		this.superCall();
		
		this.eventReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.native.StopPropagationCommand::perform");
		//console.log(aEventDataObject);
		
		var theEvent = this.eventReevaluator.reevaluate(aEventDataObject);
		theEvent.stopPropagation();
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.eventReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.eventReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aEvent) {
		var newCommand = (new StopPropagationCommand()).init();
		
		newCommand.eventReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aEvent);
		
		return newCommand;
	};
	
	staticFunctions.createCommandWithDataAsEvent = function() {
		var newCommand = (new StopPropagationCommand()).init();
		
		newCommand.eventReevaluator = GetVariableObject.createSelectDataCommand();
		
		return newCommand;
	};
});