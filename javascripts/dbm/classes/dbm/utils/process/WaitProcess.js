/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.process.WaitProcess", "dbm.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.process.WaitProcess");
	
	var WaitProcess = dbm.importClass("dbm.utils.process.WaitProcess");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.process.WaitProcess::_init");
		
		this.superCall();
		
		this._time = null;
		
		this._progress = this.createProperty("progress", 0);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("waitProcess");
	};
	
	objectFunctions.setTimeReevaluator = function(aTimeReevaluator) {
		this._time = aTimeReevaluator;
		
		return this;
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("dbm.utils.process.WaitProcess::_performStartProcess");
		
		var waitTime = this._time.reevaluate(this._dynamicData.getValue());
		
		this._progress.animateValue(1, waitTime, InterpolationTypes.LINEAR, 0);
		this.getDelayedExtendedEvent().addFunctionCall(this, this._processDone, [], waitTime);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTime) {
		var newWaitProcess = (new ClassReference()).init();
		newWaitProcess.setTimeReevaluator(StaticVariableObject.createReevaluationObject(aTime));
		return newWaitProcess;
	};
});