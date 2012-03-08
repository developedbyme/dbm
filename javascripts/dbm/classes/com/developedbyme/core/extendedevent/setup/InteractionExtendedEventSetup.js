dbm.registerClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ActivateEventLinkCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.events.ActivateEventLinkCommand");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MouseExtendedEventIds");
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
});