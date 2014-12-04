/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.console.ConsoleLine", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.console.ConsoleLine");
	//"use strict";
	
	var ConsoleLine = dbm.importClass("dbm.workspace.gui.console.ConsoleLine");
	
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	var ConsoleExtendedEventIds = dbm.importClass("dbm.workspace.constants.extendedevents.ConsoleExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.console.ConsoleLine::_init");
		
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
		newConsoleLine.setPropertyInput("console", aConsole);
		
		return newConsoleLine;
	};
	
});