/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ActivateEventLinkCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.events.ActivateEventLinkCommand");
	var PreventDefaultCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MouseExtendedEventIds");
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.addClickEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.CLICK, ButtonExtendedEventIds.CLICK, aUseCapture, ButtonExtendedEventIds.CLICK, true, true);
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		}
	};
	
	staticFunctions.addMouseOverEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.MOUSE_OVER, ButtonExtendedEventIds.MOUSE_OVER, aUseCapture, ButtonExtendedEventIds.MOUSE_OVER, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.MOUSE_OUT, ButtonExtendedEventIds.MOUSE_OUT, aUseCapture, ButtonExtendedEventIds.MOUSE_OVER, true, true);
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.MOUSE_OVER);
		}
	};
	
	staticFunctions.addPressEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addPressEvents");
		//console.log(aExtendedEventController, aHtmlElement, aActivate);
		//console.log(DomReferenceFunctions.getDocument(aHtmlElement));
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.MOUSE_DOWN, ButtonExtendedEventIds.PRESS, aUseCapture, ButtonExtendedEventIds.PRESS, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.MOUSE_UP, ButtonExtendedEventIds.RELEASE, aUseCapture, ButtonExtendedEventIds.RELEASE, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.MOUSE_UP, ButtonExtendedEventIds.RELEASE_OUTSIDE, aUseCapture, ButtonExtendedEventIds.RELEASE, true, true);
		
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.PRESS, ActivateEventLinkCommand.createCommand(aExtendedEventController, ButtonExtendedEventIds.RELEASE, true));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE, ActivateEventLinkCommand.createCommand(aExtendedEventController, ButtonExtendedEventIds.RELEASE, false));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController,ButtonExtendedEventIds.RELEASE, false));
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		}
	};
	
	staticFunctions.addPressWithMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		//(console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addPressWithMoveEvents");
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		ClassReference.addPressEvents(aExtendedEventController, aHtmlElement, aActivate, aUseCapture);
		ClassReference.addMoveEvents(aExtendedEventController, aHtmlElement, false, aUseCapture);
		
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.PRESS, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, true));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, false));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, false));
	};
	
	staticFunctions.addMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		//METODO: call local function instead of duplicate code
		aExtendedEventController.linkJavascriptEventWithCapture(DomReferenceFunctions.getDocument(aHtmlElement), JavascriptEventIds.MOUSE_MOVE, MouseExtendedEventIds.MOVE, aUseCapture, MouseExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(MouseExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addLocalMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.MOUSE_MOVE, MouseExtendedEventIds.MOVE, aUseCapture, MouseExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(MouseExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addTouchMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		ClassReference.addLocalTouchMoveEvents(aExtendedEventController, DomReferenceFunctions.getDocument(aHtmlElement), aActivate, aUseCapture);
		
	};
	
	staticFunctions.addLocalTouchMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.TOUCH_MOVE, TouchExtendedEventIds.MOVE, aUseCapture, TouchExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(TouchExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addTouchPressEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addTouchPressEvents");
		//console.log(aExtendedEventController, aHtmlElement, aActivate);
		//console.log(DomReferenceFunctions.getDocument(aHtmlElement));
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.TOUCH_START, TouchExtendedEventIds.START, aUseCapture, TouchExtendedEventIds.START, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(aHtmlElement, JavascriptEventIds.TOUCH_END, TouchExtendedEventIds.END, aUseCapture, TouchExtendedEventIds.END, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.TOUCH_END, TouchExtendedEventIds.END_OUTSIDE, aUseCapture, TouchExtendedEventIds.END, true, true);
		aExtendedEventController.linkJavascriptEventWithCapture(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.TOUCH_CANCEL, TouchExtendedEventIds.CANCEL, aUseCapture, TouchExtendedEventIds.END, true, true);
		
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.START, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, true));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.CANCEL, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(TouchExtendedEventIds.START);
		}
	};
	
	staticFunctions.addTouchPressWithMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate, aUseCapture) {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addTouchPressWithMoveEvents");
		//console.log(aExtendedEventController, aHtmlElement, aActivate);
		
		aUseCapture = VariableAliases.valueWithDefault(aUseCapture, false);
		
		ClassReference.addTouchPressEvents(aExtendedEventController, aHtmlElement, aActivate, aUseCapture);
		ClassReference.addTouchMoveEvents(aExtendedEventController, aHtmlElement, false, aUseCapture);
		
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.START, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, true));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, false));
	};
	
	staticFunctions.preventDefaultForEvent = function(aExtendedEventController, aEventName) {
		//(console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::preventDefaultForEvent");
		
		aExtendedEventController.addCommandToEvent(aEventName, PreventDefaultCommand.createCommandWithDataAsEvent());
	};
});