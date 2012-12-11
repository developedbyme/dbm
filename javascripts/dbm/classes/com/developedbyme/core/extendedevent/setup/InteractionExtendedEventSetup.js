dbm.registerClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ActivateEventLinkCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.events.ActivateEventLinkCommand");
	var PreventDefaultCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.native.PreventDefaultCommand");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MouseExtendedEventIds");
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.addClickEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.CLICK, ButtonExtendedEventIds.CLICK, ButtonExtendedEventIds.CLICK, true, true);
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		}
	};
	
	staticFunctions.addMouseOverEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.MOUSE_OVER, ButtonExtendedEventIds.MOUSE_OVER, ButtonExtendedEventIds.MOUSE_OVER, true, true);
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.MOUSE_OUT, ButtonExtendedEventIds.MOUSE_OUT, ButtonExtendedEventIds.MOUSE_OVER, true, true);
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.MOUSE_OVER);
		}
	};
	
	staticFunctions.addPressEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addPressEvents");
		//console.log(aExtendedEventController, aHtmlElement, aActivate);
		//console.log(DomReferenceFunctions.getDocument(aHtmlElement));
		
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.MOUSE_DOWN, ButtonExtendedEventIds.PRESS, ButtonExtendedEventIds.PRESS, true, true);
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.MOUSE_UP, ButtonExtendedEventIds.RELEASE, ButtonExtendedEventIds.RELEASE, true, true);
		aExtendedEventController.linkJavascriptEvent(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.MOUSE_UP, ButtonExtendedEventIds.RELEASE_OUTSIDE, ButtonExtendedEventIds.RELEASE, true, true);
		
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.PRESS, ActivateEventLinkCommand.createCommand(aExtendedEventController, ButtonExtendedEventIds.RELEASE, true));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE, ActivateEventLinkCommand.createCommand(aExtendedEventController, ButtonExtendedEventIds.RELEASE, false));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController,ButtonExtendedEventIds.RELEASE, false));
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		}
	};
	
	staticFunctions.addPressWithMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		//(console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addPressWithMoveEvents");
		
		ClassReference.addPressEvents(aExtendedEventController, aHtmlElement, aActivate);
		ClassReference.addMoveEvents(aExtendedEventController, aHtmlElement, false);
		
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.PRESS, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, true));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, false));
		aExtendedEventController.addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, MouseExtendedEventIds.MOVE, false));
	};
	
	staticFunctions.addMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		//METODO: call local function instead of duplicate code
		aExtendedEventController.linkJavascriptEvent(DomReferenceFunctions.getDocument(aHtmlElement), JavascriptEventIds.MOUSE_MOVE, MouseExtendedEventIds.MOVE, MouseExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(MouseExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addLocalMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.MOUSE_MOVE, MouseExtendedEventIds.MOVE, MouseExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(MouseExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addTouchMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		
		ClassReference.addLocalTouchMoveEvents(DomReferenceFunctions.getDocument(aHtmlElement), aHtmlElement, aActivate);
		
	};
	
	staticFunctions.addLocalTouchMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.TOUCH_MOVE, TouchExtendedEventIds.MOVE, TouchExtendedEventIds.MOVE, true, true);
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(TouchExtendedEventIds.MOVE);
		}
	};
	
	staticFunctions.addTouchPressEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addTouchPressEvents");
		//console.log(aExtendedEventController, aHtmlElement, aActivate);
		//console.log(DomReferenceFunctions.getDocument(aHtmlElement));
		
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.TOUCH_START, TouchExtendedEventIds.START, TouchExtendedEventIds.START, true, true);
		aExtendedEventController.linkJavascriptEvent(aHtmlElement, JavascriptEventIds.TOUCH_END, TouchExtendedEventIds.END, TouchExtendedEventIds.END, true, true);
		aExtendedEventController.linkJavascriptEvent(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.TOUCH_END, TouchExtendedEventIds.END_OUTSIDE, TouchExtendedEventIds.END, true, true);
		aExtendedEventController.linkJavascriptEvent(DomReferenceFunctions.getDocument(aHtmlElement).body, JavascriptEventIds.TOUCH_CANCEL, TouchExtendedEventIds.CANCEL, TouchExtendedEventIds.END, true, true);
		
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.START, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, true));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.CANCEL, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.END, false));
		
		if(aActivate) {
			aExtendedEventController.activateJavascriptEventLink(TouchExtendedEventIds.START);
		}
	};
	
	staticFunctions.addTouchPressWithMoveEvents = function(aExtendedEventController, aHtmlElement, aActivate) {
		//(console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::addTouchPressWithMoveEvents");
		
		ClassReference.addTouchPressEvents(aExtendedEventController, aHtmlElement, aActivate);
		ClassReference.addTouchMoveEvents(aExtendedEventController, aHtmlElement, false);
		
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.START, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, true));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, false));
		aExtendedEventController.addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, ActivateEventLinkCommand.createCommand(aExtendedEventController, TouchExtendedEventIds.MOVE, false));
	};
	
	staticFunctions.preventDefaultForEvent = function(aExtendedEventController, aEventName) {
		//(console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup::preventDefaultForEvent");
		
		aExtendedEventController.addCommandToEvent(aEventName, PreventDefaultCommand.createCommandWithDataAsEvent());
	};
});