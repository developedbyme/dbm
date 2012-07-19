dbm.registerClass("com.developedbyme.utils.process.ExtendedEventProcess", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.ExtendedEventProcess");
	
	var ExtendedEventProcess = dbm.importClass("com.developedbyme.utils.process.ExtendedEventProcess");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.ExtendedEventProcess::_init");
		
		this.superCall();
		
		this._command = null;
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("extendedEventProcess");
	};
	
	objectFunctions.setCommand = function(aCommand) {
		this._command = aCommand;
		
		return this;
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("com.developedbyme.utils.process.ExtendedEventProcess::_performStartProcess");
		
		var eventData = EventDataObject.create(this._dynamicData.getValue());
		var result = this._command.perform(eventData);
		
		if(result == CommandStatusTypes.CONTINUE) {
			this._processDone(eventData);
		}
		else {
			this._processError(eventData);
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCommand) {
		var newExtendedEventProcess = (new ClassReference()).init();
		newExtendedEventProcess.setCommand(aCommand);
		return newExtendedEventProcess;
	};
});