/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A button that selects a file for upload.
 */
dbm.registerClass("com.developedbyme.gui.buttons.FileUploadButton", "com.developedbyme.gui.buttons.BaseButton", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.buttons.FileUploadButton");
	
	//Self reference
	var FileUploadButton = dbm.importClass("com.developedbyme.gui.buttons.FileUploadButton");
	
	//Error report
	
	//Dependencies
	var FileInputField = dbm.importClass("com.developedbyme.gui.form.FileInputField");
	var FileReaderAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.FileReaderAsset");
	var ObjectVariableWithDefaultValueNode = dbm.importClass("com.developedbyme.flow.nodes.data.ObjectVariableWithDefaultValueNode");
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var DragAndDropExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.DragAndDropExtendedEventSetup");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var DragAndDropExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.DragAndDropExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.buttons.FileUploadButton::_init");
		
		this.superCall();
		
		this._fileReference = this.createProperty("fileReference", null);
		var selectedNode = this.addDestroyableObject(ConditionNode.create("!==", this._fileReference, null));
		selectedNode.getProperty("inputValue2").setValue(null); //MENOTE: null is ignored in the create function
		this._isSelected = this.createProperty("isSelected", selectedNode.getProperty("outputValue"));
		this._asset = null;
		
		var nameNode = this.addDestroyableObject(ObjectVariableWithDefaultValueNode.create(this._fileReference, "name", null));
		var typeNode = this.addDestroyableObject(ObjectVariableWithDefaultValueNode.create(this._fileReference, "type", null));
		var sizeNode = this.addDestroyableObject(ObjectVariableWithDefaultValueNode.create(this._fileReference, "size", -1));
		
		this._name = this.createProperty("name", nameNode.getProperty("outputValue"));
		this._type = this.createProperty("type", typeNode.getProperty("outputValue"));
		this._size = this.createProperty("size", sizeNode.getProperty("outputValue"));
		
		this._status = this.createProperty("status", 0);
		this._fileContents = this.createProperty("fileContents", null);
		
		this._hiddenFileInput = this.addDestroyableObject(FileInputField.createOnParent(dbm.getDocument(), false));
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this._hiddenFileInput, this._hiddenFileInput.triggerDialog, []));
		this._hiddenFileInput.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._setFileReference, [CallFunctionObject.createCommand(this._hiddenFileInput, this._hiddenFileInput.getValue, [])]));
		this.getExtendedEvent().addCommandToEvent(DragAndDropExtendedEventIds.DROP, CallFunctionCommand.createCommand(this, this._filesDropped, [GetVariableObject.createCommand(GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "dataTransfer"), "files")]));
		
		return this;
	};
	
	objectFunctions.getAsset = function() {
		return this._asset;
	};
	
	objectFunctions.getValue = function() {
		return this._fileReference.getValue();
	};
	
	objectFunctions.addAutoLoadCommand = function() {
		
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this.load, []));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		DragAndDropExtendedEventSetup.addDropEvents(this.getExtendedEvent(), aElement, false, false);
		
		return this;
	};
	
	objectFunctions._removeCurrentAsset = function() {
		console.log("com.developedbyme.gui.buttons.FileUploadButton::_removeCurrentAsset");
		
		if(this._asset === null) {
			//METODO: warning message
			return;
		}
		
		this._status.disconnectInput(this._asset.getProperty("status"));
		this._fileContents.disconnectInput(this._asset.getProperty("data"));
		
		this._asset = null;
	};
	
	objectFunctions._createNewAsset = function(aFileReference, aReadMode) {
		console.log("com.developedbyme.gui.buttons.FileUploadButton::_createNewAsset");
		console.log(aFileReference, aReadMode);
		
		if(this._asset !== null) {
			this._removeCurrentAsset();
		}
		
		this._asset = FileReaderAsset.create(aFileReference, aReadMode);
		this._status.connectInput(this._asset.getProperty("status"));
		this._fileContents.connectInput(this._asset.getProperty("data"));
	};
	
	objectFunctions._getReadModeForType = function(aType) {
		console.log("com.developedbyme.gui.buttons.FileUploadButton::_getReadModeForType");
		console.log(aType);
		//METODO: add overrides
		
		if(aType.indexOf("text/") === 0) {
			return "text";
		}
		else if(aType.indexOf("image/") === 0) {
			return "url";
		}
		
		return "binary";
	};
	
	objectFunctions._setFileReference = function(aFileReference) {
		console.log("com.developedbyme.gui.buttons.FileUploadButton::_setFileReference");
		console.log(aFileReference);
		
		if(aFileReference !== null) {
			this._fileReference.setValue(aFileReference);
			this._createNewAsset(aFileReference, this._getReadModeForType(aFileReference.type));
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.CHANGE)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.CHANGE, null);
			}
		}
		else {
			//METODO: warning message
		}
	};
	
	objectFunctions._filesDropped = function(aFiles) {
		console.log("com.developedbyme.gui.buttons.FileUploadButton::_filesDropped");
		console.log(aFiles);
		
		if(aFiles === null || aFiles.length === 0) {
			//METODO: error message
			return;
		}
		
		if(aFiles.length > 1) {
			//METODO: warning message
		}
		this._setFileReference(aFiles[0]);
	};
	
	objectFunctions.load = function() {
		if(this._asset === null) {
			//METODO: error message
			return this;
		}
		this._asset.load();
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this.superCall();
		
		this._hiddenFileInput.activate();
		this.getExtendedEvent().activateJavascriptEventLink(DragAndDropExtendedEventIds.DROP);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this.superCall();
		
		this._hiddenFileInput.deactivate();
		this.getExtendedEvent().deactivateJavascriptEventLink(DragAndDropExtendedEventIds.DROP);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new FileUploadButton()).init().setElement(aElement);
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
});