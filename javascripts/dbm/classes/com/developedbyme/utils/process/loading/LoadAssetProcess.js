dbm.registerClass("com.developedbyme.utils.process.loading.LoadAssetProcess", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.loading.LoadAssetProcess");
	
	var LoadAssetProcess = dbm.importClass("com.developedbyme.utils.process.loading.LoadAssetProcess");
	
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
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.loading.LoadAssetProcess::_init");
		
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
		//console.log("com.developedbyme.utils.process.loading.LoadAssetProcess::_performStartProcess");
		
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