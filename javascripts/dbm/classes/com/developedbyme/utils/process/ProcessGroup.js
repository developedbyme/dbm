dbm.registerClass("com.developedbyme.utils.process.ProcessGroup", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.ProcessGroup");
	
	var ProcessGroup = dbm.importClass("com.developedbyme.utils.process.ProcessGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.ProcessGroup::_init");
		
		this.superCall();
		
		this._internalStartSignal = this.createProperty("internalStartSignal", false);
		this._doneMarker = this.createProperty("doneMarker", false);
		this._errorMarker = this.createProperty("errorMarker", false);
		this._internalResultData = this.createProperty("internalResultData", null);
		this._updateDone = this.createGhostProperty("updateDone");
		this._updateError = this.createGhostProperty("updateError");
		
		this._updateFunctions.getObject("updateStartSignal").addOutputConnection(this._internalStartSignal);
		
		this.createUpdateFunction("updateDone", this._updateDoneFlow, [this._doneMarker, this._internalResultData], [this._updateDone]);
		this.createUpdateFunction("updateError", this._updateErrorFlow, [this._errorMarker, this._internalResultData], [this._updateError]);
		
		this._nodes = ArrayHolder.create(true);
		this.addDestroyableObject(this._nodes);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("processGroup");
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("com.developedbyme.utils.process.ProcessGroup::_performStartProcess");
		
		this.superCall();
		
		this._internalStartSignal.setValue(true);
		this._updateDone.startUpdating();
		this._updateError.startUpdating();
		
		//console.log(this._internalStartSignal.getValue());
	};
	
	objectFunctions.addNode = function(aNode) {
		this._nodes.array.push(aNode);
		
		return this;
	};
	
	objectFunctions.addStartNode = function(aNode) {
		
		aNode.connectStartSignal(this._internalStartSignal);
		
		return this;
	};
	
	objectFunctions.setDoneNode = function(aNode) {
		
		aNode.getStatusToSignalNodeOutput(ProcessStatusTypes.DONE).connectOutput(this._doneMarker);
		
		return this;
	};
	
	objectFunctions.setErrorNode = function(aNode) {
		
		aNode.getStatusToSignalNodeOutput(ProcessStatusTypes.ERROR).connectOutput(this._errorMarker);
		
		return this;
	};
	
	objectFunctions._updateDoneFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.process.ProcessGroup::_updateDoneFlow");
		
		if(this._doneMarker.getValueWithoutFlow()) {
			this._processDone(this._internalResultData.getValueWithoutFlow());
			this._updateDone.stopUpdating();
			this._updateError.stopUpdating();
		}
	};
	
	objectFunctions._updateErrorFlow = function(aFlowUpdateNumber) {
		if(this._errorMarker.getValueWithoutFlow()) {
			this._processError(this._internalResultData.getValueWithoutFlow());
			this._updateDone.stopUpdating();
			this._updateError.stopUpdating();
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newProcessGroup = (new ClassReference()).init();
		return newProcessGroup;
	};
});