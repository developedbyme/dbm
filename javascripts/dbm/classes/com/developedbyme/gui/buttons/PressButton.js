dbm.registerClass("com.developedbyme.gui.buttons.PressButton", "com.developedbyme.gui.buttons.BaseButton", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.buttons.PressButton");
	
	var PressButton = dbm.importClass("com.developedbyme.gui.buttons.PressButton");
	
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var CssCursorTypes = dbm.importClass("com.developedbyme.constants.CssCursorTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.buttons.PressButton::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		InteractionExtendedEventSetup.addPressEvents(this.getExtendedEvent(), aElement, false);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this.superCall();
		
		this.getExtendedEvent().activateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this.superCall();
		
		this.getExtendedEvent().deactivateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		
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