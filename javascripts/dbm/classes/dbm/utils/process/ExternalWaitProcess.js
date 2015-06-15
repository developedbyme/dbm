/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.process.ExternalWaitProcess", "dbm.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.process.ExternalWaitProcess");
	
	var ExternalWaitProcess = dbm.importClass("dbm.utils.process.ExternalWaitProcess");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.process.ExternalWaitProcess::_init");
		
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
		//console.log("dbm.utils.process.ExternalWaitProcess::_performStartProcess");
		
		this._updateExternalMarker.startUpdating();
	};
	
	objectFunctions._updateExternalMarkerFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.utils.process.ExternalWaitProcess::_updateExternalMarkerFlow");
		
		var externalMarkerValue = this._externalMarker.getValueWithoutFlow();
		
		if(externalMarkerValue === 1) {
			this._processDone(null);
			this._updateExternalMarker.stopUpdating();
		}
		if(externalMarkerValue === -1) {
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