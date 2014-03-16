/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup", "com.developedbyme.nodejs.server.router.RouterGroup", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup");
	//"use strict";
	
	var ErrorCheckingRouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup::_init");
		
		this.superCall();
		
		this._errorRouter = null;
		
		return this;
	};
	
	objectFunctions.setErrorRouter = function(aErrorRouter) {
		this._errorRouter = aErrorRouter;
		
		return this;
	};
	
	objectFunctions._routerDone = function(aRoutedData) {
		//console.log("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup::_routerDone");
		//console.log(this._id);
		
		if(aRoutedData.getStatus() === RoutedDataStatusTypes.ERROR) {
			//METODO: this could be asyncronous
			this._errorRouter.route(aRoutedData);
		}
		
		this.superCall(aRoutedData);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aErrorRouter) {
		//console.log("com.developedbyme.nodejs.server.router.ErrorCheckingRouterGroup::create");
		//console.log(aElement);
		
		var newErrorCheckingRouterGroup = (new ClassReference()).init();
		
		newErrorCheckingRouterGroup.setErrorRouter(aErrorRouter);
		
		return newErrorCheckingRouterGroup;
	};
});