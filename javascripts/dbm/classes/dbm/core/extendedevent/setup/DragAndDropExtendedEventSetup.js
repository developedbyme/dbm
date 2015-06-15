/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.setup.DragAndDropExtendedEventSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.setup.DragAndDropExtendedEventSetup");
	
	//Self reference
	var DragAndDropExtendedEventSetup = dbm.importClass("dbm.core.extendedevent.setup.DragAndDropExtendedEventSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ActivateEventLinkCommand = dbm.importClass("dbm.core.extendedevent.commands.events.ActivateEventLinkCommand");
	var PreventDefaultCommand = dbm.importClass("dbm.core.extendedevent.commands.native.PreventDefaultCommand");
	var StopPropagationCommand = dbm.importClass("dbm.core.extendedevent.commands.native.StopPropagationCommand");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	var DragAndDropExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.DragAndDropExtendedEventIds");
	
	staticFunctions.addDropEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.DRAG_ENTER, DragAndDropExtendedEventIds.DRAG_ENTER, aUseCapture, DragAndDropExtendedEventIds.DROP, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.DRAG_OVER, DragAndDropExtendedEventIds.DRAG_OVER, aUseCapture, DragAndDropExtendedEventIds.DROP, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.DRAG_LEAVE, DragAndDropExtendedEventIds.DRAG_LEAVE, aUseCapture, DragAndDropExtendedEventIds.DROP, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.DROP, DragAndDropExtendedEventIds.DROP, aUseCapture, DragAndDropExtendedEventIds.DROP, true, true);
		
		DragAndDropExtendedEventSetup.preventDefaultForEvent(aExtendedEventController, DragAndDropExtendedEventIds.DRAG_OVER);
		DragAndDropExtendedEventSetup.preventDefaultForEvent(aExtendedEventController, DragAndDropExtendedEventIds.DROP);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(DragAndDropExtendedEventIds.DROP);
		}
	};
	
	staticFunctions.preventDefaultForEvent = function(aExtendedEventController, aEventName) {
		//(console.log("dbm.core.extendedevent.setup.DragAndDropExtendedEventSetup::preventDefaultForEvent");
		
		aExtendedEventController.addCommandToEvent(aEventName, StopPropagationCommand.createCommandWithDataAsEvent());
		aExtendedEventController.addCommandToEvent(aEventName, PreventDefaultCommand.createCommandWithDataAsEvent());
	};
});