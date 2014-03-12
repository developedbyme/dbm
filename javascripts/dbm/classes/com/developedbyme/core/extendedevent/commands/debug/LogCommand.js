dbm.registerClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
	//Self reference
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
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
		//console.log("com.developedbyme.core.extendedevent.commands.debug.LogCommand::_init");
		
		this.superCall();
		
		this.argumentsArrayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.debug.LogCommand::perform");
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