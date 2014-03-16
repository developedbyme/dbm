/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.process.ProcessObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.ProcessObject");
	
	var ProcessObject = dbm.importClass("com.developedbyme.utils.process.ProcessObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.ProcessObject::_init");
		
		this.superCall();
		
		this._instanceId = this._createId();
		this._status = this.createProperty("status", ProcessStatusTypes.NOT_STARTED);
		this._startSignal = this.createProperty("startSignal", false);
		this._isStarted = false;
		this._dynamicData = this.createProperty("dynamicData", null);
		this._resultData = this.createProperty("resultData", null);
		//METODO: cancel type
		
		this._statusToSignalNodes = NamedArray.create(true);
		this.addDestroyableObject(this._statusToSignalNodes);
		
		this.createUpdateFunction("updateStartSignal", this._updateStartSignalFlow, [this._startSignal, this._dynamicData], [this._status, this._resultData]);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("process");
	};
	
	objectFunctions._createNamedId = function(aName) {
		return dbm.singletons.dbmIdManager.getNewId(aName);
	};
	
	objectFunctions.getStatus = function() {
		return this._status.getValue();
	};
	
	objectFunctions.getStatusToSignalNodeOutput = function(aStatusType) {
		var statusName = ProcessStatusTypes.getStatusName(aStatusType);
		if(this._statusToSignalNodes.select(statusName)) {
			return this._statusToSignalNodes.currentSelectedItem;
		}
		var newNode = ConditionNode.create("==", this._status, aStatusType);
		
		this._statusToSignalNodes.addObject(statusName, newNode);
		return newNode.getProperty("outputValue");
	};
	
	objectFunctions.connectStartSignal = function(aProperty) {
		this.getProperty("startSignal").connectInput(aProperty);
	};
	
	objectFunctions._updateStartSignalFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.process.ProcessObject::_updateStartSignalFlow");
		//console.log(this._instanceId, this._startSignal.getValueWithoutFlow());
		if(this._startSignal.getValueWithoutFlow()) {
			this.startProcess();
		}
	};
	
	objectFunctions.startProcess = function() {
		//console.log("com.developedbyme.utils.process.ProcessObject::startProcess");
		//console.log(this._instanceId, this._isStarted);
		
		if(this._isStarted) return;
		
		this._isStarted = true;
		this._status.setValue(ProcessStatusTypes.STARTED);
		
		this._performStartProcess();
		
		return this;
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("com.developedbyme.utils.process.ProcessObject::_performStartProcess");
		//console.log(this._instanceId);
		
		//MENOTE should be overridden
	};
	
	objectFunctions._processDone = function(aResultData) {
		//console.log("com.developedbyme.utils.process.ProcessObject::_processDone");
		
		this._resultData.setValue(aResultData);
		
		this._status.setValue(ProcessStatusTypes.DONE);
	};
	
	objectFunctions._processError = function(aResultData) {
		//console.log("com.developedbyme.utils.process.ProcessObject::_processError");
		
		this._resultData.setValue(aResultData);
		
		this._status.setValue(ProcessStatusTypes.ERROR);
	};
	
	objectFunctions.connectInput = function(aProcessObject, aStatusType) {
		//console.log("com.developedbyme.utils.process.ProcessObject::connectInput");
		ClassReference.connectObjects(aProcessObject, this, aStatusType);
	};
	
	objectFunctions.connectOutput = function(aProcessObject, aStatusType) {
		//console.log("com.developedbyme.utils.process.ProcessObject::connectOutput");
		ClassReference.connectObjects(this, aProcessObject, aStatusType);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case ProcessExtendedEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._status = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newProcessObject = (new ClassReference()).init();
		return newProcessObject;
	};
	
	staticFunctions.connectObjects = function(aOutputObject, aInputObject, aStatusType) {
		aInputObject.connectStartSignal(aOutputObject.getStatusToSignalNodeOutput(aStatusType));
	};
});