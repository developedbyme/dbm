/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.process.WaitProcess", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.WaitProcess");
	
	var WaitProcess = dbm.importClass("com.developedbyme.utils.process.WaitProcess");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.WaitProcess::_init");
		
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
		//console.log("com.developedbyme.utils.process.WaitProcess::_performStartProcess");
		
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