/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.ExtendedEventController", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.ExtendedEventController");
	
	//Self reference
	var ExtendedEventController = dbm.importClass("dbm.core.extendedevent.ExtendedEventController");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	var EventLinkGroup = dbm.importClass("dbm.core.extendedevent.eventlink.EventLinkGroup");
	var EventLink = dbm.importClass("dbm.core.extendedevent.eventlink.EventLink");
	var EventPerformer = dbm.importClass("dbm.core.extendedevent.eventperformer.EventPerformer");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.ExtendedEventController::_init");
		
		this.superCall();
		
		this._owner = null;
		
		this._eventPerformers = NamedArray.create(true);
		this.addDestroyableObject(this._eventPerformers);
		
		this._eventLinkGroups = NamedArray.create(true);
		this.addDestroyableObject(this._eventLinkGroups);
		
		return this;
	};
	
	objectFunctions.setOwner = function(aOwner) {
		this._owner = aOwner;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventName, aData) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::perform");
		//console.log(aEventName, aData);
		
		if(this._isDestroyed) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Event controller is destroyed, can't perform " + aEventName + ".");
			return;
		}
		
		var eventDataObject = EventDataObject.create(aData, this._owner, this._owner);
		
		if(this._eventPerformers.select(aEventName)) {
			this._eventPerformers.currentSelectedItem.perform(eventDataObject);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Event " + aEventName + " doesn't exist.");
		}
		eventDataObject.destroy();
	};
	
	objectFunctions.performFromExternal = function(aEventName, aEventDataObject) {
		
		if(this._isDestroyed) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "performFromExternal", "Event controller is destroyed, can't perform " + aEventName + ".");
			return;
		}
		
		if(this._eventPerformers.select(aEventName)) {
			this._eventPerformers.currentSelectedItem.perform(aEventDataObject);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "performFromExternal", "Event " + aEventName + " doesn't exist.");
		}
	};
	
	objectFunctions.createEventLinkGroup = function(aName) {
		if(this._eventLinkGroups.select(aName)) {
			var oldGroup = this._eventLinkGroups.currentSelectedItem;
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "createEventLinkGroup", "Event link group " + aName + " already exist. Replacing.");
			oldGroup.destroy();
			this._eventLinkGroups.removeObject(aName);
		}
		
		var newGroup = (new EventLinkGroup()).init();
		newGroup.name = aName;
		this._eventLinkGroups.addObject(aName, newGroup);
		
		return newGroup;
	};
	
	objectFunctions.getEventLinkGroup = function(aName) {
		var theGroup = this._eventLinkGroups.getObject(aName);
		if(!VariableAliases.isSet(theGroup)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getEventLinkGroup", "Event link group " + aName + " doesn't exist.");
			return null;
		}
		return theGroup;
	};
	
	objectFunctions.removeEventLinkGroup = function(aName) {
		if(!this._eventLinkGroups.select(aName)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "removeEventLinkGroup", "Event link group " + aName + " doesn't exist.");
			return;
		}
		var theGroup = this._eventLinkGroups.currentSelectedItem;
		theGroup.destroy();
		this._eventLinkGroups.removeObject(aName);
	};
	
	objectFunctions.hasEventLinkGroup = function(aName) {
		return this._eventLinkGroups.hasObject(aName);
	};
	
	
	objectFunctions.addEventLink = function(aEventLink, aGroupName, aDontWarnOnCreation) {
		if(!VariableAliases.isSet(aGroupName)) {
			aGroupName = this._defaultEventLinkGroupName;
		}
		
		var currentGroup;
		if(this._eventLinkGroups.select(aGroupName)) {
			currentGroup = this._eventLinkGroups.currentSelectedItem;
		}
		else {
			if(!aDontWarnOnCreation && aGroupName !== this._defaultEventLinkGroupName) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NOTICE, this, "addEventLink", "Event link group " + aGroupName + " doesn't exist, creating.");
			}
			currentGroup = this.createEventLinkGroup(aGroupName);
		}
		
		currentGroup.addLink(aEventLink);
	};
	
	objectFunctions.linkJavascriptEventWithCapture = function(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aUseCapture, aGroupName, aDontWarnOnCreation, aCreateEvent) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::_linkJavascriptEvent");
		//console.log(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aGroupName, aDontWarnOnCreation, aCreateEvent);
		if(!VariableAliases.isSet(aJavascriptEventName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "linkJavascriptEventWithCapture", "Javascript event is null for " + aExtendedEventName + " on " + this._owner + ".");
			return null;
		}
		else if(!VariableAliases.isSet(aExtendedEventName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "linkJavascriptEventWithCapture", "Extended event event is null for " + aJavascriptEventName + " on " + this._owner + ".");
			return null;
		}
		
		var newEventLink = EventLink.create(this, aEventDispatcher, aJavascriptEventName, aExtendedEventName, aUseCapture);
		
		this.addEventLink(newEventLink, aGroupName, aDontWarnOnCreation);
		if(aCreateEvent) {
			if(!this.hasEvent(aExtendedEventName)) {
				this.createEvent(aExtendedEventName);
			}
		}
		
		return newEventLink;
	};
	
	objectFunctions.linkJavascriptEvent = function(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aGroupName, aDontWarnOnCreation, aCreateEvent) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::linkJavascriptEvent");
		//console.log(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aGroupName, aDontWarnOnCreation, aCreateEvent);
		
		return this.linkJavascriptEventWithCapture(aEventDispatcher, aJavascriptEventName, aExtendedEventName, false, aGroupName, aDontWarnOnCreation, aCreateEvent);
	};
	
	objectFunctions.activateJavascriptEventLink = function(aName) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::activateJavascriptEventLink");
		//console.log(aName);
		if(!VariableAliases.isSet(aName)) {
			aName = this._defaultEventLinkGroupName;
		}
		
		if(this._eventLinkGroups.select(aName)) {
			//console.log("active eventLinkGroup : ", aName);
			this._eventLinkGroups.currentSelectedItem.activateAll();
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "activateJavascriptEventLink", "Javascript event link " + aName + " doesn't exist.");
		}
	};
	
	objectFunctions.deactivateJavascriptEventLink = function(aName) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::deactivateJavascriptEventLink");
		//console.log(aName);
		//console.log("this._eventLinkGroups.select(aName) : ", this._eventLinkGroups.select(aName));
		if(this._eventLinkGroups.select(aName)) {
			this._eventLinkGroups.currentSelectedItem.deactivateAll();
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "deactivateJavascriptEventLink", "Javascript event link " + aName + " doesn't exist.");
		}
	};
	
	objectFunctions.createEvent = function(aName) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::createEvent");
		var newPerformer = (new EventPerformer()).init();
		
		this.addEvent(aName, newPerformer);
		
		return newPerformer;
	};
	
	objectFunctions.addEvent = function(aName, aPerformer) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::addEvent");
		if(this._eventPerformers.select(aName)) {
			var oldPerformer = this._eventPerformers.currentSelectedItem;
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addEvent", "Event " + aName + " already exist. Replacing.");
			oldPerformer.destroy();
			this._eventPerformers.removeObject(aName);
		}
		
		this._eventPerformers.addObject(aName, aPerformer);
	};
	
	objectFunctions.removeEvent = function(aName) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::removeEvent");
		this._eventPerformers.removeObject(aName);
		
		if(this._groupsController !== null) {
			this._groupsController.recreateEventIfCommandsExists(aName);
		}
	};
	
	objectFunctions.getEvent = function(aName, aDontWarnOnCreation) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::getEvent");
		var thePerformer;
		
		//console.log(aName, this._eventPerformers.select(aName), aDontWarnOnCreation);
		if(this._eventPerformers.select(aName)) {
			thePerformer = this._eventPerformers.currentSelectedItem;
		}
		else {
			if(!aDontWarnOnCreation) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "getEvent", "Event " + aName + " doesn't exist. Creating.");
			}
			thePerformer = this.createEvent(aName);
		}
		
		return thePerformer;
	};
	
	objectFunctions.hasEvent = function(aName) {
		return this._eventPerformers.hasObject(aName);
	};
	
	objectFunctions.addCommandToEvent = function(aEventName, aCommand) {
		//console.log("dbm.core.extendedevent.ExtendedEventController::addCommandToEvent");
		
		if(!VariableAliases.isSet(aCommand)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addCommandToEvent", "Command is null.");
			return null;
		}
		
		if(aCommand.id === null) {
			aCommand.id = "autoId_" + aEventName;
		}
		
		var dontShowWarnings = false;
		if(this._owner._extendedEvent_eventIsExpected !== undefined) {
			dontShowWarnings = this._owner._extendedEvent_eventIsExpected(aEventName);
		}
		
		var currentPerformer = this.getEvent(aEventName, dontShowWarnings);
		currentPerformer.addCommand(aCommand);
		
		return aCommand;
	};
	
	objectFunctions.removeCommandFromEvent = function(aEventName, aCommand) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer === null) {
			return;
		}
		currentPerformer.removeCommand(aCommand);
	};
	
	objectFunctions.removeCommandByIdFromEvent = function(aEventName, aId) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer === null) {
			return;
		}
		currentPerformer.removeCommandById(aId);
	};
	
	objectFunctions.hasCommandWithId = function(aEventName, aId) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer === null) {
			return false;
		}
		return currentPerformer.hasCommandWithId(aId);
	};
	
	objectFunctions.reactivateEventListeners = function() {
		var currentArray = this._eventLinkGroups.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGroup = currentArray[i];
			currentGroup.reactivateAll();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._owner = null;
		this._eventPerformers = null;
		this._eventLinkGroups = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_owner":
				return false;
		}
		return this.superCall();
	};
	
	staticFunctions.create = function(aOwner) {
		return (new ExtendedEventController()).init().setOwner(aOwner);
	};
	
});