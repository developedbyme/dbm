dbm.registerClass("com.developedbyme.core.extendedevent.eventlink.EventLink", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink");
	
	var EventLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.EventLink");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::_init");
		
		this.superCall();
		
		this._isActive = false;
		
		this._performerObject = null;
		this._eventDispatcher = null;
		this._javascriptEventName = null;
		this._extendedEventName = null;
		
		var thisPointer = this;
		this._eventCallback = function _eventCallback(aEvent) {
			//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::_eventCallback");
			//console.log(aEvent);
			//console.log(thisPointer._javascriptEventName);
			if(thisPointer._performerObject == null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, thisPointer, "_eventCallback", "Performer object is null.");
				return true;
			}
			thisPointer._performerObject.perform(thisPointer._extendedEventName, aEvent);
			return true;
		}
		
		return this;
	};
	
	objectFunctions.setupLink = function setupLink(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName) {
		
		this._performerObject = aEventPerformer;
		this._eventDispatcher = aEventDispatcher;
		this._javascriptEventName = aJavascriptEventName;
		this._extendedEventName = aExtendedEventName;
		
		return this;
	};
	
	objectFunctions.activate = function activate() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::activate");
		//console.log(this._javascriptEventName, this._extendedEventName);
		if(this._isActive) return this;
		
		this._isActive = true;
		try {
			this._eventDispatcher.addEventListener(this._javascriptEventName, this._eventCallback, false);
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "activate", "Event listener " + this._javascriptEventName + " couldn't be added to.");
			ErrorManager.getInstance().reportError(this, "activate", theError);
		}
		
		return this;
	};
	
	objectFunctions.deactivate = function deactivate() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::deactivate");
		if(!this._isActive) return this;
		
		this._isActive = false;
		
		try {
			this._eventDispatcher.removeEventListener(this._javascriptEventName, this._eventCallback, false);
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "deactivate", "Event listener " + this._javascriptEventName + " couldn't be removed from.");
			ErrorManager.getInstance().reportError(this, "deactivate", theError);
		}
		
		return this;
	};
	
	objectFunctions.reactivate = function reactivate() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::reactivate");
		if(this._isActive && this._eventDispatcher != null) {
			this._eventDispatcher.addEventListener(this._javascriptEventName, this._eventCallback, false);
		}
		
		return this;
	};
	
	objectFunctions.performDestroy = function performDestroy() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLink::performDestroy");
		//console.log(this._javascriptEventName);
		
		if(this._isActive && this._eventDispatcher != null) {
			this.deactivate();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function setAllReferencesToNull() {
		
		this._performerObject = null;
		this._eventDispatcher = null;
		this._javascriptEventName = null;
		this._extendedEventName = null;
		this._eventCallback = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function create(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName) {
		return (new EventLink()).init().setupLink(aEventPerformer, aEventDispatcher, aJavascriptEventName, aExtendedEventName);
	};
	
});