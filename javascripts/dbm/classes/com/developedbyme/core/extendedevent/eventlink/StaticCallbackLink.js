dbm.registerClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var EventListenerFunctions = dbm.importClass("com.developedbyme.utils.native.function.EventListenerFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink::_init");
		
		this.superCall();
		
		this._isActive = false;
		
		this._performerObject = null;
		this._extendedEventName = null;
		
		this._eventCallback = EventListenerFunctions.createCallbackFunction(this);
		
		return this;
	};
	
	objectFunctions.getCallbackFunction = function() {
		return this._eventCallback;
	};
	
	objectFunctions.setupLink = function(aEventPerformer, aExtendedEventName) {
		
		this._performerObject = aEventPerformer;
		this._extendedEventName = aExtendedEventName;
		
		return this;
	};
	
	objectFunctions.activate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink::activate");
		//console.log(this._javascriptEventName, this._extendedEventName, this._useCapture);
		if(this._isActive) return this;
		
		this._isActive = true;
		
		//MENOTE: do nothing
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink::deactivate");
		if(!this._isActive) return this;
		
		this._isActive = false;
		
		//MENOTE: do nothing
		
		return this;
	};
	
	objectFunctions.reactivate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink::reactivate");
		
		//MENOTE: do nothing
		
		return this;
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink::performDestroy");
		//console.log(this._javascriptEventName);
		
		if(this._isActive && this._eventDispatcher !== null) {
			this.deactivate();
		}
		if(this._eventCallback !== null && this._eventCallback._deleteEventCallback !== null) {
			this._eventCallback._deleteEventCallback();
			this._eventCallback._deleteEventCallback = null;
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._performerObject = null;
		this._extendedEventName = null;
		this._eventCallback = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aEventPerformer, aExtendedEventName) {
		
		return (new StaticCallbackLink()).init().setupLink(aEventPerformer, aExtendedEventName);
	};
	
	staticFunctions.createAndAddCallbackLink = function(aEventPerformer, aExtendedEventName) {
		var newStaticCallbackLink = ClassReference.create(aEventPerformer, aExtendedEventName);
		
		aEventPerformer.addEventLink(newStaticCallbackLink, aExtendedEventName, true);
		
		return newStaticCallbackLink;
	};
	
	staticFunctions.addSetOfCallbackLinks = function(aEventPerformer, aExtendedEventNames, aReturnNamedArray) {
		
		var currnetArray = aExtendedEventNames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currnetArray[i];
			var newStaticCallbackLink = ClassReference.createAndAddCallbackLink(aEventPerformer, currentName);
			aReturnNamedArray.addObject(currentName, newStaticCallbackLink);
		}
	};
});