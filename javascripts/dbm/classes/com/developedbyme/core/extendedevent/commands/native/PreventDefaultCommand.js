dbm.registerClass("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand");
	
	var PreventDefaultCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand::_init");
		
		this.superCall();
		
		this.eventReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand::perform");
		//console.log(aEventDataObject);
		
		var theEvent = this.eventReevaluator.reevaluate(aEventDataObject);
		theEvent.preventDefault();
		
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
		var newCommand = (new PreventDefaultCommand()).init();
		
		newCommand.eventReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aEvent);
		
		return newCommand;
	};
	
	staticFunctions.createCommandWithDataAsEvent = function() {
		var newCommand = (new PreventDefaultCommand()).init();
		
		newCommand.eventReevaluator = GetVariableObject.createSelectDataCommand();
		
		return newCommand;
	}
});