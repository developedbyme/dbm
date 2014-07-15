/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for all buttons.
 */
dbm.registerClass("com.developedbyme.gui.buttons.BaseButton", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	
	//Error report
	
	//Dependencies
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	//Utils
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var CssCursorTypes = dbm.importClass("com.developedbyme.constants.CssCursorTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.buttons.BaseButton::_init");
		
		this.superCall();
		
		this._isActive = false;
		this._useHandCursor = true;
		
		//this._isActive = this.createProperty("isActive", false);
		//this._isActiveOutput = this.createProperty("isActiveOutput", this._isActive);
		//this._isActiveUpdate = ; //METODO: add any change property
		//this._isActiveUpdate.connectInput(this._isActiveOutput);
		
		this._rollOverState = this.createProperty("rollOverState", false);
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OVER, SetPropertyCommand.createCommand(this._rollOverState, true));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OUT, SetPropertyCommand.createCommand(this._rollOverState, false));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		InteractionExtendedEventSetup.addClickEvents(this.getExtendedEvent(), aElement, false);
		InteractionExtendedEventSetup.addMouseOverEvents(this.getExtendedEvent(), aElement, false);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this._isActive = true;
		
		if(this._useHandCursor) {
			this.setStyleProperty("cursor", CssCursorTypes.POINTER);
		}
		
		this.getExtendedEvent().activateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		this.getExtendedEvent().activateJavascriptEventLink(ButtonExtendedEventIds.MOUSE_OVER);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this._isActive = false;
		
		if(this._useHandCursor) {
			this.removeStyleProperty("cursor");
		}
		
		this.getExtendedEvent().deactivateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		this.getExtendedEvent().deactivateJavascriptEventLink(ButtonExtendedEventIds.MOUSE_OVER);
		
		this._rollOverState.setValue(false);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ButtonExtendedEventIds.CLICK:
			case ButtonExtendedEventIds.MOUSE_OVER:
			case ButtonExtendedEventIds.MOUSE_OUT:
			case ButtonExtendedEventIds.PRESS:
			case ButtonExtendedEventIds.RELEASE:
			case ButtonExtendedEventIds.RELEASE_OUTSIDE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._rollOverState = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new BaseButton()).init().setElement(aElement);
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