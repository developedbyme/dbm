dbm.registerClass("com.developedbyme.nodejs.server.router.RouterGroup", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.RouterGroup");
	//"use strict";
	
	var RouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.RouterGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	staticFunctions.ID_COUNTER = 0;
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::_init");
		
		this.superCall();
		
		this._id = ClassReference.ID_COUNTER++;
		
		this._maintainExclusiveness = false;
		this._isExclusive = false;
		
		this._routers = new Array();
		this._routedData = new Array();
		
		this._callbackCommand = CallFunctionCommand.createCommand(this, this._childRouterDone, [GetVariableObject.createSelectDataCommand(), GetVariableObject.createSelectOwnerObjectCommand()]);
		this._callbackCommand.retain();
		
		return this;
	};
	
	objectFunctions.setMaintainExclusiveness = function(aValue) {
		this._maintainExclusiveness = VariableAliases.valueWithDefault(aValue, true);
	};
	
	objectFunctions._preCheckRouting = function(aRoutedData) {
		//MENOTE: should be overridden
		return true;
	};
	
	objectFunctions.addRouter = function(aRouter) {
		console.log("com.developedbyme.nodejs.server.router.RouterGroup::addRouter");
		
		this._routers.push(aRouter);
		
		aRouter.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, this._callbackCommand);
		
		return this;
	};
	
	objectFunctions.route = function(aRoutedData) {
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::route");
		//console.log(this._id);
		
		if(!this._preCheckRouting(aRoutedData)) {
			return aRoutedData.getStatus();
		}
		
		this._routedData.push(aRoutedData);
		
		this._continueRoute(aRoutedData, 0, false);
		return RoutedDataStatusTypes.UNKNOWN;
	};
	
	objectFunctions._continueRoute = function(aRoutedData, aNextPosition) {
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::_continueRoute");
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
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::_childRouterDone");
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
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::_routerDone");
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
		//console.log("com.developedbyme.nodejs.server.router.RouterGroup::create");
		//console.log(aElement);
		
		var newRouterGroup = (new ClassReference()).init();
		
		return newRouterGroup;
	};
});