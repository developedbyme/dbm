/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.debug.LogCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.debug.LogCommand");
	
	//Self reference
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.debug.LogCommand::_init");
		
		this.superCall();
		
		this.argumentsArrayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.debug.LogCommand::perform");
		//console.log(aEventDataObject);
		
		var argumentsArray = this.argumentsArrayReevaluator.reevaluate(aEventDataObject);
		
		ErrorManager.getInstance().report(ReportTypes.LOG, ReportLevelTypes.NORMAL, this, "perform", argumentsArray);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.argumentsArrayReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.argumentsArrayReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(/* ... aArgumentsArray */) {
		var newCommand = (new LogCommand()).init();
		
		var aArgumentsArray = arguments;
		if(aArgumentsArray.length === 1) {
			newCommand.argumentsArrayReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aArgumentsArray[0]);
		}
		else {
			newCommand.argumentsArrayReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArgumentsArray);
		}
		
		return newCommand;
	};
});