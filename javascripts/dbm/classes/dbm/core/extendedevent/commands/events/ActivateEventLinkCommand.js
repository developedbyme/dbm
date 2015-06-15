/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand");
	
	var ActivateEventLinkCommand = dbm.importClass("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand::_init");
		
		this.superCall();
		
		this.extendedEventControllerReevaluator = null;
		this.linkNameReevaluator = null;
		this.activeReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand::perform");
		//console.log(aEventDataObject);
		
		var extendedEventController = this.extendedEventControllerReevaluator.reevaluate(aEventDataObject);
		var isActive = this.activeReevaluator.reevaluate(aEventDataObject);
		var linkName = this.linkNameReevaluator.reevaluate(aEventDataObject);
		
		if(isActive) {
			extendedEventController.activateJavascriptEventLink(linkName);
		}
		else {
			extendedEventController.deactivateJavascriptEventLink(linkName);
		}
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.extendedEventControllerReevaluator);
		ClassReference.softDestroyIfExists(this.linkNameReevaluator);
		ClassReference.softDestroyIfExists(this.activeReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.extendedEventControllerReevaluator = null;
		this.linkNameReevaluator = null;
		this.activeReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aExtendedEventController, aLinkName, aActivate) {
		var newCommand = (new ActivateEventLinkCommand()).init();
		
		newCommand.extendedEventControllerReevaluator = StaticVariableObject.createReevaluationObject(aExtendedEventController);
		newCommand.linkNameReevaluator = StaticVariableObject.createReevaluationObject(aLinkName);
		newCommand.activeReevaluator = StaticVariableObject.createReevaluationObject(aActivate);
		
		return newCommand;
	};
	
	staticFunctions.createCallFunctionOnObjectCommand = function(aObject, aLinkName, aActivate) {
		var newCommand = (new ActivateEventLinkCommand()).init();
		
		newCommand.extendedEventControllerReevaluator = CallFunctionObject.createFunctionOnObjectCommand(aObject, "getExtendedEventController", []);
		
		newCommand.linkNameReevaluator = StaticVariableObject.createReevaluationObject(aLinkName);
		newCommand.activeReevaluator = StaticVariableObject.createReevaluationObject(aActivate);
		
		return newCommand;
	};
});