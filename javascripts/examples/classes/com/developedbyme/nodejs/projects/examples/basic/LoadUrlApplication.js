/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.projects.examples.basic.LoadUrlApplication", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var LoadUrlApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.basic.LoadUrlApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var HttpLoadedAsset = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.LoadUrlApplication::_init");
		
		this.superCall();
		
		this._asset = null;
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.basic.LoadUrlApplication::start");
		
		this._asset = HttpLoadedAsset.create("http://www.developedbyme.com");
		this._asset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._dataLoaded, [GetVariableObject.createSelectDataCommand()]));
		
		this._asset.load();
	};
	
	objectFunctions._dataLoaded = function(aData) {
		console.log("com.developedbyme.nodejs.projects.examples.basic.LoadUrlApplication::_dataLoaded");
		console.log(aData);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});