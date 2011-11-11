dbm.registerClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.debug.LogCommand::init");
		
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
		
		aArgumentsArray = arguments;
		
		var hasReevaluatorInArgumentsArray = false;
		var theLength = aArgumentsArray.length;
		for(var i = 0; i < theLength; i++) {
			if(aArgumentsArray[i] instanceof ReevaluationBaseObject) {
				hasReevaluatorInArgumentsArray = true;
				break;
			}
		}
		
		if(hasReevaluatorInArgumentsArray) {
			newCommand.argumentsArrayReevaluator = ReevaluateArrayObject.createReevaluationObject(aArgumentsArray);
		}
		else {
			newCommand.argumentsArrayReevaluator = StaticVariableObject.createReevaluationObject(aArgumentsArray);
		}
		
		return newCommand;
	}
});