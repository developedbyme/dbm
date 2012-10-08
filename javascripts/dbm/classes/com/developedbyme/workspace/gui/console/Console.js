dbm.registerClass("com.developedbyme.workspace.gui.console.Console", "com.developedbyme.workspace.gui.panels.HtmlPanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.console.Console");
	//"use strict";
	
	var Console = dbm.importClass("com.developedbyme.workspace.gui.console.Console");
	
	var ConsoleLine = dbm.importClass("com.developedbyme.workspace.gui.console.ConsoleLine");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var ConsoleExtendedEventIds = dbm.importClass("com.developedbyme.workspace.constants.extendedevents.ConsoleExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.console.Console::_init");
		
		this.superCall();
		
		this._lines = new Array();
		this._currentLine = null;
		
		return this;
	};
	
	objectFunctions.createNewLine = function() {
		
		if(this._currentLine !== null) {
			this._currentLine.print();
		}
		
		var htmlCreator = this.getHtmlCreator();
		var element = htmlCreator.createDiv();
		this._currentLine = ConsoleLine.createOnConsole(this, element);
		
		this._currentLine.getExtendedEvent().addCommandToEvent(ConsoleExtendedEventIds.PRINT_LINE, CallFunctionCommand.createCommand(this, this._linePrinted, [this._currentLine]).setAsRemovable());
		
		return this._currentLine;
	};
	
	objectFunctions._linePrinted = function(aLine) {
		if(aLine == this._currentLine) {
			this._currentLine = null;
		}
	};
	
	objectFunctions.getCurrentLine = function() {
		
		if(this._currentLine === null) {
			this.createNewLine();
		}
		
		return this._currentLine;
	};
	
	objectFunctions.addTextLine = function(aText, aTextType) {
		
		var newTextLine = this.createNewLine();
		newTextLine.addText(aText);
		newTextLine.print();
		
		return this;
	};
	
	objectFunctions.addButton = function(aText, aCommand) {
		
		var newTextLine = this.getCurrentLine();
		var newButton = BaseButton.createButton(newTextLine.getElement(), true, null, aText);
		if(aCommand != null) {
			newButton.getExtendedEvent().addCommandToEvent("click", aCommand);
		}
		newButton.activate();
		newTextLine.addButton(newButton);
		
		return newButton;
	};
	
	objectFunctions.addCallFunctionButton = function(aText, aThisObject, aFunction, aArgumentsArray) {
		
		return this.addButton(aText, CallFunctionCommand.createCommand(aThisObject, aFunction, aArgumentsArray));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAttributes) {
		return ClassReference._create(ClassReference, aAttributes);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference._createOnParent(ClassReference, aParentOrDocument, aAddToParent, aAttributes);
	};
	
});