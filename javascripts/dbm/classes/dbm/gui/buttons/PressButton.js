/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A button that responds to press and release, as well as click and rollovers.
 */
dbm.registerClass("dbm.gui.buttons.PressButton", "dbm.gui.buttons.BaseButton", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.buttons.PressButton");
	
	//Self reference
	var PressButton = dbm.importClass("dbm.gui.buttons.PressButton");
	
	//Error report
	
	//Dependencies
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	var OneTouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.OneTouchOrMouseDetector");
	
	//Utils
	var InteractionExtendedEventSetup = dbm.importClass("dbm.core.extendedevent.setup.InteractionExtendedEventSetup");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	var PerformExtendedEventCommand = dbm.importClass("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.buttons.PressButton::_init");
		
		this.superCall();
		
		this._pressDetector = this.addDestroyableObject((new OneTouchOrMouseDetector()).init());
		this._pressDetector.preventEventDefaults();
		
		var selectionPoint = this._pressDetector.getSelectionPoint();
		
		selectionPoint.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.START, PerformExtendedEventCommand.createCommand(this, ButtonExtendedEventIds.PRESS, null));
		selectionPoint.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, PerformExtendedEventCommand.createCommand(this, ButtonExtendedEventIds.RELEASE, null));
		selectionPoint.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, PerformExtendedEventCommand.createCommand(this, ButtonExtendedEventIds.RELEASE, null));
		selectionPoint.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, PerformExtendedEventCommand.createCommand(this, ButtonExtendedEventIds.RELEASE_OUTSIDE, null));
		
		//METODO: click event
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		this._pressDetector.setElement(aElement);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this.superCall();
		
		this._pressDetector.activate();
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this.superCall();
		
		this._pressDetector.deactivate();
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new PressButton()).init().setElement(aElement);
	};
	
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createButton = function(aParentOrDocument, aAddToParent, aAttributes, aText) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createNode("button", aAttributes));
		
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		var newText = TextElement.create(newNode.getElement(), true, aText);
		newNode.addDestroyableObject(newText);
		
		return newNode;
	};
});