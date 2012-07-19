dbm.registerClass("com.developedbyme.utils.process.ExternalWaitProcess", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.ExternalWaitProcess");
	
	var ExternalWaitProcess = dbm.importClass("com.developedbyme.utils.process.ExternalWaitProcess");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.ExternalWaitProcess::_init");
		
		this.superCall();
		
		this._externalMarker = this.createProperty("externalMarker", 0);
		this._updateExternalMarker = this.createGhostProperty("updateExternalMarker");
		
		this.createUpdateFunction("updateDone", this._updateExternalMarkerFlow, [this._externalMarker], [this._updateExternalMarker]);
		
		this._progress = this.createProperty("progress", 0);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("externalWaitProcess");
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("com.developedbyme.utils.process.ExternalWaitProcess::_performStartProcess");
		
		this._updateExternalMarker.startUpdating();
	};
	
	objectFunctions._updateExternalMarkerFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.process.ExternalWaitProcess::_updateExternalMarkerFlow");
		
		var externalMarkerValue = this._externalMarker.getValueWithoutFlow();
		
		if(externalMarkerValue == 1) {
			this._processDone(null);
			this._updateExternalMarker.stopUpdating();
		}
		if(externalMarkerValue == -1) {
			this._processError(null);
			this._updateExternalMarker.stopUpdating();
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputProperty) {
		var newExternalWaitProcess = (new ClassReference()).init();
		if(!VariableAliases.isNull(aInputProperty)) {
			newExternalWaitProcess.getProperty("externalMarker").connectInput(aInputProperty);
		}
		return newExternalWaitProcess;
	};
});