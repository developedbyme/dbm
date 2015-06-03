/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.GraphData", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.GraphData");
	
	//Self reference
	var GraphData = dbm.importClass("dbm.thirdparty.facebook.GraphData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptWithCallbackLoader = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("dbm.core.extendedevent.eventlink.StaticCallbackLink");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	
	staticFunctions._LOADED_CALLBACK = "loadedCallback";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.thirdparty.facebook.GraphData::_init");
		
		this.superCall();
		
		this._api = null;
		
		this._id = this.createProperty("id", null);
		this._loaded = this.createProperty("loaded", false);
		this._data = this.createProperty("data", null);
		
		this._loadingCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._LOADED_CALLBACK);
		this.getExtendedEvent().addEventLink(this._loadingCallbackEventLink, ClassReference._LOADED_CALLBACK, true);
		this.getExtendedEvent().addCommandToEvent(ClassReference._LOADED_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_loaded, [GetVariableObject.createSelectDataCommand()]));
		
		
		return this;
	};
	
	objectFunctions.load = function() {
		//console.log("dbm.thirdparty.facebook.GraphData::load");
		//console.log(this._api);
		
		this._api.api(this._id.getValue(), this._loadingCallbackEventLink.getCallbackFunction());
	};
	
	objectFunctions.setup = function(aApi, aId) {
		//console.log("dbm.thirdparty.facebook.GraphData::setup");
		this._api = aApi;
		this._id.setValue(aId);
		
		return this;
	};
	
	objectFunctions._callback_loaded = function(aEvent) {
		//console.log("dbm.thirdparty.facebook.GraphData::_callback_loaded");
		//console.log(aEvent);
		
		if(!VariableAliases.isSet(aEvent.error)) {
			this._data.setValue(aEvent);
			
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADED)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED, null);
			}
		}
		else {
			//METODO: error message
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.ERROR_LOADING)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.ERROR_LOADING, null);
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aApi, aId) {
		
		var newGraphData = (new ClassReference()).init();
		
		newGraphData.setup(aApi, aId);
		
		return newGraphData;
	};
});