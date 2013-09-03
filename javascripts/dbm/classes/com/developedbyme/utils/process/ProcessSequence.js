dbm.registerClass("com.developedbyme.utils.process.ProcessSequence", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.ProcessSequence");
	
	var ProcessSequence = dbm.importClass("com.developedbyme.utils.process.ProcessSequence");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	staticFunctions.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_PROCESSES = 5;
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.ProcessSequence::_init");
		
		this.superCall();
		
		this._groupId = dbm.singletons.dbmIdManager.getNewId("processSequence");
		
		this._time = this.createProperty("time", dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"));
		this._progress = this.createProperty("progress", 0);
		this._maxNumberOfSimiltaniousProcesses = ClassReference.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_PROCESSES;
		this._processes = new Array();
		this._startedProcesses = new Array();
		this._waitingProcesses = new Array();
		this._doneProcesses = new Array();
		
		this._continueOnError = true;
		this._status = ProcessStatusTypes.NOT_STARTED;
		this._isProcessing = false;
		
		this.createUpdateFunction("progress", this._updateProgressFlow, [this._time], [this._progress]);
		
		return this;
	};
	
	objectFunctions.getStatus = function() {
		return this._status;
	};
	
	objectFunctions.startProcess = function() {
		//console.log("com.developedbyme.utils.process.ProcessSequence::startProcess");
		
		if(this._isProcessinging) return;
		
		this._isProcessing = true;
		this._status = ProcessStatusTypes.STARTED;
		this._continueProcess();
		
		return this;
	};
	
	objectFunctions._addListenersToProcess = function(aProcess) {
		
		aProcess.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, CallFunctionCommand.createCommand(this, this._processDone, [aProcess]).setId(this._groupId));
		aProcess.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.ERROR, CallFunctionCommand.createCommand(this, this._processError, [aProcess]).setId(this._groupId));
		
	};
	
	objectFunctions._startWaitingProcess = function(aProcess) {
		//console.log("com.developedbyme.utils.process.ProcessSequence::_startWaitingProcess");
		//console.log(this, aProcess);
		
		this._status = ProcessStatusTypes.STARTED;
		
		if(aProcess.getStatus() === ProcessStatusTypes.DONE) {
			this._doneProcesses.push(aProcess);
		}
		else if(aProcess.getStatus() === ProcessStatusTypes.ERROR) {
			this._doneProcesses.push(aProcess);
			if(!this._continueOnError) {
				this._isProcessing = false;
				this._status = ProcessStatusTypes.ERROR;
				if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.ERROR)) {
					this.getExtendedEvent().perform(ProcessExtendedEventIds.ERROR);
				}
			}
		}
		else if(aProcess.getStatus() === ProcessStatusTypes.STARTED) {
			this._addListenersToProcess(aProcess);
			this._startedProcesses.push(aProcess);
		}
		else {
			this._startProcessProcess(aProcess);
		}
	};
	
	objectFunctions._startProcessProcess = function(aProcess) {
		
		this._addListenersToProcess(aProcess);
		this._startedProcesses.push(aProcess);
		aProcess.load();
	};
	
	objectFunctions._continueProcess = function() {
		//console.log("com.developedbyme.utils.process.ProcessSequence::_continueProcess");
		
		while(this._waitingProcesses.length > 0) {
			var currentProcess = this._waitingProcesses.shift();
			this._startWaitingProcess(currentProcess);
			if(!(this._isProcessing && (this._startedProcesses.length < this._maxNumberOfSimiltaniousProcesses || this._maxNumberOfSimiltaniousProcesses <= 0))) {
				break;
			}
		}
		
		if(this._startedProcesses.length === 0 && this._waitingProcesses === 0 && this._status === ProcessStatusTypes.STARTED) {
			this._status = ProcessStatusTypes.DONE;
			if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
				this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE);
			}
		}
	};
	
	objectFunctions._setProcessAsLoaded = function(aProcess) {
		
		var currentIndex = ArrayFunctions.indexOfInArray(this._startedProcesses, aProcess);
		if(currentIndex !== -1) {
			this._startedProcesses.splice(currentIndex, 1);
		}
		
		this._doneProcesses.push(aProcess);
		
		aProcess.getExtendedEvent().removeCommandByIdFromEvent(ProcessExtendedEventIds.DONE, this._groupId);
		aProcess.getExtendedEvent().removeCommandByIdFromEvent(ProcessExtendedEventIds.ERROR, this._groupId);
		
	};
	
	objectFunctions._processDone = function(aProcess) {
		//console.log("com.developedbyme.utils.process.ProcessSequence::_processDone");
		
		this._setProcessAsLoaded(aProcess);
		this._continueProcess();
	};
	
	objectFunctions._processError = function(aProcess) {
		
		this._setProcessAsLoaded(aProcess);
		
		if(!this._continueOnError) {
			this._isProcessing = false;
			this._status = ProcessStatusTypes.ERROR;
			if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.ERROR)) {
				this.getExtendedEvent().perform(ProcessExtendedEventIds.ERROR);
			}
		}
	};
	
	objectFunctions._updateProgressFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.process.ProcessSequence::_updateProgressFlow");
		
		//METODO
	}
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case ProcessExtendedEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyArrayIfExists(this._processes);
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._progress = null;
		this._processes = null;
		this._startedProcesses = null;
		this._waitingProcesses = null;
		this._doneProcesses = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newProcessSequence = (new ClassReference()).init();
		return newProcessSequence;
	};
});