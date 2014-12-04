/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.process.ExtendedEventProcess", "dbm.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.process.ExtendedEventProcess");
	
	var ExtendedEventProcess = dbm.importClass("dbm.utils.process.ExtendedEventProcess");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("dbm.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.process.ExtendedEventProcess::_init");
		
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
		//console.log("dbm.utils.process.ExtendedEventProcess::_performStartProcess");
		
		var eventData = EventDataObject.create(this._dynamicData.getValue());
		var result = this._command.perform(eventData);
		
		if(result === CommandStatusTypes.CONTINUE) {
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