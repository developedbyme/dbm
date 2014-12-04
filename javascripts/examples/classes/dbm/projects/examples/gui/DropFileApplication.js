/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.gui.DropFileApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DropFileApplication = dbm.importClass("dbm.projects.examples.gui.DropFileApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var DragAndDropExtendedEventSetup = dbm.importClass("dbm.core.extendedevent.setup.DragAndDropExtendedEventSetup");
	
	//Constants
	var DragAndDropExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.DragAndDropExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.gui.DropFileApplication::_init");
		
		this.superCall();
		
		this._textHolder = null;
		this._text = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.gui.DropFileApplication::_createPage");
		
		var dropArea = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 100%; height: 100%;"});
		DragAndDropExtendedEventSetup.addDropEvents(dropArea.getExtendedEvent(), dropArea.getElement(), true, false);
		
		this._textHolder = DisplayBaseObject.createNode("pre", dropArea.getElement(), true);
		this._text = TextElement.create(this._textHolder.getElement(), true, "");
		
		dropArea.getExtendedEvent().addCommandToEvent(DragAndDropExtendedEventIds.DRAG_ENTER, CallFunctionCommand.createCommand(this, this._callback_filesDraggedOver, [GetVariableObject.createSelectDataCommand()]));
		dropArea.getExtendedEvent().addCommandToEvent(DragAndDropExtendedEventIds.DROP, CallFunctionCommand.createCommand(this, this._callback_filesDropped, [GetVariableObject.createSelectDataCommand()]));
	};
	
	objectFunctions._callback_filesDraggedOver = function(aEvent) {
		console.log("dbm.projects.examples.gui.DropFileApplication::_callback_filesDraggedOver");
		console.log(aEvent);
		console.log(aEvent.dataTransfer.files.length);
		console.log(aEvent.dataTransfer.types);
		//aEvent.dataTransfer.dropEffect = "copy";
	};
	
	objectFunctions._callback_filesDropped = function(aEvent) {
		console.log("dbm.projects.examples.gui.DropFileApplication::_callback_filesDropped");
		
		var printText = "";
		
		var currentArray = aEvent.dataTransfer.files;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			console.log(currentArray[i]);
			var currentFile = currentArray[i];
			
			printText += currentFile.name + " (type: " + currentFile.type + ", size: " + currentFile.size + ", lastModifiedDate: " + currentFile.lastModifiedDate + ")" + "\n";
		}
		
		this._text.getProperty("text").setValue(printText);
		this._text.getProperty("display").update();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});