/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.eventlink.CustomFunctionEventLink", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.eventlink.CustomFunctionEventLink");
	
	//Self reference
	var CustomFunctionEventLink = dbm.importClass("dbm.core.extendedevent.eventlink.CustomFunctionEventLink");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var EventListenerFunctions = dbm.importClass("dbm.utils.native.function.EventListenerFunctions");
	
	/**
	 * Constants
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.eventlink.CustomFunctionEventLink::_init");
		
		this.superCall();
		
		this._isActive = false;
		
		this._performerObject = null;
		this._extendedEventName = null;
		
		this._activateCommand = null;
		this._deactivateCommand = null;
		
		this._eventCallback = null;
		
		return this;
	};
	
	objectFunctions.setCommands = function(aEventPerformer, aExtendedEventName, aActivateCommand, aDeactivateCommand, aCallbackType) {
		
		var aCallbackType = VariableAliases.valueWithDefault(aCallbackType, "default");
		
		switch(aCallbackType) {
			case "single":
				this._eventCallback = EventListenerFunctions.createSingleEventObjectCallback(this);
				break;
			case "multiple":
				this._eventCallback = EventListenerFunctions.createMultipleArgumentsCallback(this);
				break;
			default:
				//METODO: error mesage
			case "default":
				this._eventCallback = EventListenerFunctions.createCallbackFunction(this);
				break;
		}
		
		this._performerObject = aEventPerformer;
		this._extendedEventName = aExtendedEventName;
		
		this._activateCommand = this.addDestroyableObject(aActivateCommand.retain());
		this._deactivateCommand = this.addDestroyableObject(aDeactivateCommand.retain());
		
		return this;
	};
	
	objectFunctions.activate = function() {
		//console.log("dbm.core.extendedevent.eventlink.CustomFunctionEventLink::activate");
		//console.log(this._javascriptEventName, this._extendedEventName, this._useCapture);
		if(this._isActive) return this;
		
		this._isActive = true;
		
		var eventDataObject = EventDataObject.create(this._eventCallback, null, null);
		this._activateCommand.perform(eventDataObject);
		eventDataObject.destroy();
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		//console.log("dbm.core.extendedevent.eventlink.CustomFunctionEventLink::deactivate");
		if(!this._isActive) return this;
		
		this._isActive = false;
		
		var eventDataObject = EventDataObject.create(this._eventCallback, null, null);
		this._deactivateCommand.perform(eventDataObject);
		eventDataObject.destroy();
		
		return this;
	};
	
	objectFunctions.reactivate = function() {
		//console.log("dbm.core.extendedevent.eventlink.CustomFunctionEventLink::reactivate");
		if(this._isActive && this._eventDispatcher !== null) {
			var eventDataObject = EventDataObject.create(this._eventCallback, null, null);
			this._activateCommand.perform(eventDataObject);
			eventDataObject.destroy();
		}
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._performerObject = null;
		this._extendedEventName = null;
		
		this._activateCommand = null;
		this._deactivateCommand = null;
		
		this._eventCallback = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aEventPerformer, aExtendedEventName, aActivateCommand, aDeactivateCommand, aCallbackType) {
		
		return (new CustomFunctionEventLink()).init().setCommands(aEventPerformer, aExtendedEventName, aActivateCommand, aDeactivateCommand, aCallbackType);
	};
	
});