/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.eventlink.EventLink", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink");
	
	var EventLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.EventLink");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var EventListenerFunctions = dbm.importClass("com.developedbyme.utils.native.function.EventListenerFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::_init");
		
		this.superCall();
		
		this._isActive = false;
		
		this._performerObject = null;
		this._eventDispatcher = null;
		this._javascriptEventName = null;
		this._extendedEventName = null;
		this._useCapture = false;
		
		this._eventCallback = EventListenerFunctions.createCallbackFunction(this);
		
		return this;
	};
	
	objectFunctions.setupLink = function(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName, aUseCapture) {
		
		this._performerObject = aEventPerformer;
		this._eventDispatcher = aEventDispatcher;
		this._javascriptEventName = aJavascriptEventName;
		this._extendedEventName = aExtendedEventName;
		this._useCapture = aUseCapture;
		
		return this;
	};
	
	objectFunctions.activate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::activate");
		//console.log(this._javascriptEventName, this._extendedEventName, this._useCapture);
		if(this._isActive) return this;
		
		this._isActive = true;
		try {
			EventListenerFunctions.addEventListener(this._eventDispatcher, this._javascriptEventName, this._eventCallback, this._useCapture);
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "activate", "Event listener " + this._javascriptEventName + " couldn't be added to.");
			ErrorManager.getInstance().reportError(this, "activate", theError);
		}
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::deactivate");
		if(!this._isActive) return this;
		
		this._isActive = false;
		
		try {
			EventListenerFunctions.removeEventListener(this._eventDispatcher, this._javascriptEventName, this._eventCallback, this._useCapture);
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "deactivate", "Event listener " + this._javascriptEventName + " couldn't be removed from.");
			ErrorManager.getInstance().reportError(this, "deactivate", theError);
		}
		
		return this;
	};
	
	objectFunctions.reactivate = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::reactivate");
		if(this._isActive && this._eventDispatcher !== null) {
			EventListenerFunctions.addEventListener(this._eventDispatcher, this._javascriptEventName, this._eventCallback, this._useCapture);
		}
		
		return this;
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::performDestroy");
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
		this._eventDispatcher = null;
		this._javascriptEventName = null;
		this._extendedEventName = null;
		this._eventCallback = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName, aUseCapture) {
		
		return (new EventLink()).init().setupLink(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName, aUseCapture);
	};
	
});