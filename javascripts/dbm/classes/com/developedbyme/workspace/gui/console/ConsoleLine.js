dbm.registerClass("com.developedbyme.workspace.gui.console.ConsoleLine", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.console.ConsoleLine");
	//"use strict";
	
	var ConsoleLine = dbm.importClass("com.developedbyme.workspace.gui.console.ConsoleLine");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var ConsoleExtendedEventIds = dbm.importClass("com.developedbyme.workspace.constants.extendedevents.ConsoleExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.console.ConsoleLine::_init");
		
		this.superCall();
		
		this._console = this.createProperty("console", null);
		
		return this;
	};
	
	objectFunctions.addText = function(aText) {
		var newElement = TextElement.create(this.getElement(), true, aText);
		this.addDestroyableObject(newElement);
		return this;
	};
	
	objectFunctions.addButton = function(aButton) {
		//MENOTE: What to do here
	};
	
	objectFunctions.print = function() {
		
		this._inDom.setValue(true);
		this._display.update();
		
		if(this.getExtendedEvent().hasEvent(ConsoleExtendedEventIds.PRINT_LINE)) {
			this.getExtendedEvent().perform(ConsoleExtendedEventIds.PRINT_LINE, null);
		}
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ConsoleExtendedEventIds.PRINT_LINE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.createOnConsole = function(aConsole, aElement) {
		var newConsoleLine = (new ClassReference()).init();
		
		newConsoleLine.setElement(aElement);
		newConsoleLine.setParent(aConsole);
		newConsoleLine.setPropertyInput("console", aConsole.getObjectProperty());
		
		return newConsoleLine;
	};
	
});