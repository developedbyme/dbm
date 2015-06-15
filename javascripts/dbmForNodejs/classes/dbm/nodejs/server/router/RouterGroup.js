/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.server.router.RouterGroup", "dbm.nodejs.server.router.RouterBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.RouterGroup");
	//"use strict";
	
	//Self reference
	var RouterGroup = dbm.importClass("dbm.nodejs.server.router.RouterGroup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	
	staticFunctions.ID_COUNTER = 0;
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.RouterGroup::_init");
		
		this.superCall();
		
		this._id = ClassReference.ID_COUNTER++;
		
		this._maintainExclusiveness = false;
		this._isExclusive = false;
		
		this._routers = new Array();
		this._routedData = new Array();
		
		this._callbackCommand = CallFunctionCommand.createCommand(this, this._childRouterDone, [GetVariableObject.createSelectDataCommand(), GetVariableObject.createSelectOwnerObjectCommand()]);
		this._callbackCommand.retain();
		this.addDestroyableObject(this._callbackCommand);
		
		return this;
	};
	
	objectFunctions.setMaintainExclusiveness = function(aValue) {
		this._maintainExclusiveness = VariableAliases.valueWithDefault(aValue, true);
	};
	
	objectFunctions.addRouter = function(aRouter) {
		console.log("dbm.nodejs.server.router.RouterGroup::addRouter");
		
		this._routers.push(aRouter);
		
		aRouter.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, this._callbackCommand);
		
		return this;
	};
	
	objectFunctions._performRoute = function(aRoutedData) {
		this._routedData.push(aRoutedData);
		
		this._continueRoute(aRoutedData, 0);
		return RoutedDataStatusTypes.UNKNOWN;
	};
	
	objectFunctions._continueRoute = function(aRoutedData, aNextPosition) {
		//console.log("dbm.nodejs.server.router.RouterGroup::_continueRoute");
		//console.log(this._id);
		//console.log(this._routers);
		
		var isDone = true;
		var currentPosition = aNextPosition;
		var debugCounter = 0;
		while(currentPosition < this._routers.length) {
			if(debugCounter++ > 10000) {
				break;
			}
			var currentStatus;
			try {
				currentStatus = this._routers[currentPosition].route(aRoutedData);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_continueRoute", "Error occured in " + this._routers[currentPosition]);
				ErrorManager.getInstance().reportError(this, "_continueRoute", theError);
				aRoutedData.setError("Unknown error occured", theError);
				currentStatus = RoutedDataStatusTypes.ERROR;
			}
			
			if(currentStatus === RoutedDataStatusTypes.UNHANDLED) {
				currentPosition++;
			}
			else {
				if(currentStatus === RoutedDataStatusTypes.UNKNOWN) {
					isDone = false;
				}
				break;
			}
		}
		
		if(isDone) {
			this._routerDone(aRoutedData);
		}
	};
	
	objectFunctions._childRouterDone = function(aRoutedData, aRouter) {
		//console.log("dbm.nodejs.server.router.RouterGroup::_childRouterDone");
		//console.log(this._id);
		//console.log(aRoutedData.getStatus());
		
		if(aRoutedData.getStatus() !== RoutedDataStatusTypes.UNHANDLED) {
			this._routerDone(aRoutedData);
			return;
		}
		
		var currentPosition = ArrayFunctions.indexOfInArray(this._routers, aRouter);
		if(currentPosition !== -1) {
			this._continueRoute(aRoutedData, currentPosition+1);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_childRouterDone", "Callback from unknown router " + aRouter);
			aRoutedData.setError("Callback from unknown router", null);
			this._routerDone(aRoutedData);
		}
	};
	
	objectFunctions._routerDone = function(aRoutedData) {
		//console.log("dbm.nodejs.server.router.RouterGroup::_routerDone");
		//console.log(this._id);
		
		ArrayFunctions.removeFromArray(this._routedData, aRoutedData);
		
		if(aRoutedData.getStatus() === RoutedDataStatusTypes.UNHANDLED_EXCLUSIVE && !this._maintainExclusiveness) {
			aRoutedData.setStatus(RoutedDataStatusTypes.UNHANDLED);
		}
		
		if(aRoutedData.getStatus() === RoutedDataStatusTypes.UNHANDLED && this._isExclusive) {
			aRoutedData.setStatus(RoutedDataStatusTypes.UNHANDLED_EXCLUSIVE);
		}
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, aRoutedData);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.nodejs.server.router.RouterGroup::create");
		//console.log(aElement);
		
		var newRouterGroup = (new ClassReference()).init();
		
		return newRouterGroup;
	};
});