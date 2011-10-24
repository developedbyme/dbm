dbm.registerClass("com.developedbyme.core.extendedevent.ExtendedEventController", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.ExtendedEventController");
	
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var EventLinkGroup = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup");
	var EventLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.EventLink");
	var EventPerformer = dbm.importClass("com.developedbyme.core.extendedevent.eventperformer.EventPerformer");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::init");
		
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
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::perform");
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
		if(theGroup == null) {
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
		if(aGroupName == null) {
			aGroupName = this._defaultEventLinkGroupName;
		}
		
		var currentGroup;
		if(this._eventLinkGroups.select(aGroupName)) {
			currentGroup = this._eventLinkGroups.currentSelectedItem;
		}
		else {
			if(!aDontWarnOnCreation && aGroupName != this._defaultEventLinkGroupName) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NOTICE, this, "addEventLink", "Event link group " + aGroupName + " doesn't exist, creating.");
			}
			currentGroup = this.createEventLinkGroup(aGroupName);
		}
		
		currentGroup.addLink(aEventLink);
	};
	
	objectFunctions.linkJavascriptEvent = function(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aGroupName, aDontWarnOnCreation, aCreateEvent) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::linkJavascriptEvent");
		//console.log(aEventDispatcher, aJavascriptEventName, aExtendedEventName, aGroupName, aDontWarnOnCreation, aCreateEvent);
		if(aJavascriptEventName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "linkJavascriptEvent", "Javascript event is null for " + aExtendedEventName + " on " + this._owner + ".");
			return;
		}
		else if(aExtendedEventName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "linkJavascriptEvent", "Extended event event is null for " + aJavascriptEventName + " on " + this._owner + ".");
			return;
		}
		
		
		var newEventLink = EventLink.create(this, aEventDispatcher, aJavascriptEventName, aExtendedEventName);
		
		this.addEventLink(newEventLink, aGroupName, aDontWarnOnCreation);
		if(aCreateEvent) {
			if(!this.hasEvent(aExtendedEventName)) {
				this.createEvent(aExtendedEventName);
			}
		}
		
		return newEventLink;
	};
	
	objectFunctions.activateJavascriptEventLink = function(aName) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::activateJavascriptEventLink");
		//console.log(aName);
		if(aName == null) {
			aName = this._defaultEventLinkGroupName;
		}
		
		if(this._eventLinkGroups.select(aName)) {
			this._eventLinkGroups.currentSelectedItem.activateAll();
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "activateJavascriptEventLink", "Javascript event link " + aName + " doesn't exist.");
		}
	};
	
	objectFunctions.deactivateJavascriptEventLink = function(aName) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::deactivateJavascriptEventLink");
		//console.log(aName);
		if(this._eventLinkGroups.select(aName)) {
			this._eventLinkGroups.currentSelectedItem.deactivateAll();
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "deactivateJavascriptEventLink", "Javascript event link " + aName + " doesn't exist.");
		}
	};
	
	objectFunctions.createEvent = function(aName) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::createEvent");
		var newPerformer = (new EventPerformer()).init();
		
		this.addEvent(aName, newPerformer);
		
		return newPerformer;
	};
	
	objectFunctions.addEvent = function(aName, aPerformer) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::addEvent");
		if(this._eventPerformers.select(aName)) {
			var oldPerformer = this._eventPerformers.currentSelectedItem;
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addEvent", "Event " + aName + " already exist. Replacing.");
			oldPerformer.destroy();
			this._eventPerformers.removeObject(aName);
		}
		
		this._eventPerformers.addObject(aName, aPerformer);
	};
	
	objectFunctions.removeEvent = function(aName) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::removeEvent");
		this._eventPerformers.removeObject(aName);
		
		if(this._groupsController != null) {
			this._groupsController.recreateEventIfCommandsExists(aName);
		}
	};
	
	objectFunctions.getEvent = function(aName, aDontWarnOnCreation) {
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::getEvent");
		var thePerformer;
		
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
		//console.log("com.developedbyme.core.extendedevent.ExtendedEventController::addCommandToEvent");
		if(aCommand.id == null) {
			aCommand.id = "autoId_" + aEventName;
		}
		
		var dontShowWarnings = false;
		if(this._owner._extendedEvent_eventIsExpected != undefined) {
			dontShowWarnings = this._owner._extendedEvent_eventIsExpected(aEventName);
		}
		
		var currentPerformer = this.getEvent(aEventName, dontShowWarnings);
		currentPerformer.addCommand(aCommand);
		
		return aCommand;
	};
	
	objectFunctions.removeCommandFromEvent = function(aEventName, aCommand) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer == null) {
			return;
		}
		currentPerformer.removeCommand(aCommand);
	};
	
	objectFunctions.removeCommandByIdFromEvent = function(aEventName, aId) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer == null) {
			return;
		}
		currentPerformer.removeCommandById(aId);
	};
	
	objectFunctions.hasCommandWithId = function(aEventName, aId) {
		var currentPerformer = this.getEvent(aEventName, true);
		if(currentPerformer == null) {
			return false;
		}
		return currentPerformer.hasCommandWithId(aId);
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