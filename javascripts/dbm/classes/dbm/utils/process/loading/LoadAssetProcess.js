/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.process.loading.LoadAssetProcess", "dbm.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.process.loading.LoadAssetProcess");
	
	var LoadAssetProcess = dbm.importClass("dbm.utils.process.loading.LoadAssetProcess");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	var InterpolationTypes = dbm.importClass("dbm.constants.generic.InterpolationTypes");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.process.loading.LoadAssetProcess::_init");
		
		this.superCall();
		
		this._asset = null;
		
		this._progress = this.createProperty("progress", 0);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("loadAssetProcess");
	};
	
	objectFunctions.setAssetReevaluator = function(aAssetReevaluator) {
		this._asset = aAssetReevaluator;
		
		return this;
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("dbm.utils.process.loading.LoadAssetProcess::_performStartProcess");
		
		var loadAsset = this._asset.reevaluate(this._dynamicData.getValue());
		
		loadAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._processDone, [loadAsset]));
		loadAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._processError, [loadAsset]));
		
		//METODO: link up progress
		
		loadAsset.load();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAsset) {
		var newLoadAssetProcess = (new ClassReference()).init();
		newLoadAssetProcess.setAssetReevaluator(StaticVariableObject.createReevaluationObject(aAsset));
		return newLoadAssetProcess;
	};
});