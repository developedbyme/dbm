/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.Workspace", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.Workspace");
	//"use strict";
	
	//Self reference
	var Workspace = dbm.importClass("dbm.workspace.gui.Workspace");
	
	//Error report
	
	//Dependencies
	var TouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.TouchOrMouseDetector");
	var GenericClickTool = dbm.importClass("dbm.workspace.gui.tools.generic.GenericClickTool");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	var LayoutController = dbm.importClass("dbm.workspace.gui.LayoutController");
	var BaseWorkspacePart = dbm.importClass("dbm.workspace.gui.parts.BaseWorkspacePart");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	//Constants
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.Workspace::_init");
		
		this.superCall();
		
		this._currentTool = GenericClickTool.create();
		this._availableTools = new Array();
		this._currentSelection = new Array();
		this._isInteracting = false;
		
		this._layoutController = this.addDestroyableObject(LayoutController.create());
		this._layoutArea = BaseWorkspacePart.create();
		
		this._touchDetector = (new TouchOrMouseDetector()).init();
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._startTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, CallFunctionCommand.createCommand(this, this._updateTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._endTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CANCEL, CallFunctionCommand.createCommand(this, this._cancelTouch, [GetVariableObject.createSelectDataCommand()]));
		
		this._workspaceAreaRectangleGenerator = RectangleFromValuesNode.create(0, 0, 100, 100);
		
		var rootNode = this._layoutController.getTreeStructure().getRoot();
		this._layoutArea.setTreeStructureItem(rootNode);
		rootNode.getAttribute("properties").setPropertyInput("inputArea", this._workspaceAreaRectangleGenerator.getProperty("outputRectangle"));
		rootNode.getAttribute("properties").setPropertyInput("parent", this._element);
		
		this.setDynamicVariable("layoutController", this._layoutController);
		this.setDynamicVariable("layoutArea", this._layoutArea);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._touchDetector.setElement(aElement);
		this._touchDetector.activate();
		
		return this;
	};
	
	objectFunctions.linkElementSizeToWorkspaceArea = function() {
		this._workspaceAreaRectangleGenerator.setPropertyInput("width", this.getProperty("width"));
		this._workspaceAreaRectangleGenerator.setPropertyInput("height", this.getProperty("height"));
		
		return this;
	};
	
	objectFunctions.setWorkspaceSize = function(aWidth, aHeight) {
		this._workspaceAreaRectangleGenerator.setPropertyValue("width", aWidth);
		this._workspaceAreaRectangleGenerator.setPropertyValue("height", aHeight);
		
		return this;
	};
	
	objectFunctions.addPart = function(aPath, aPart) {
		//console.log("dbm.workspace.gui.Workspace::addPart");
		
		this._layoutController.addPart(aPath, aPart);
	};
	
	objectFunctions.addToSelection = function(aObject) {
		console.log("dbm.workspace.gui.Workspace::addToSelection");
	};
	
	objectFunctions.removeFromSelection = function(aObject) {
		console.log("dbm.workspace.gui.Workspace::removeFromSelection");
	};
	
	objectFunctions.setSelection = function(aObjectsArray) {
		console.log("dbm.workspace.gui.Workspace::setSelection");
	};
	
	objectFunctions._startTouch = function(aTouchData) {
		console.log("dbm.workspace.gui.Workspace::_startTouch");
		var result = this._currentTool.startTouch(this, this._currentSelection);
		console.log(result);
		
		if(result) this._touchDetector.stopEvent();
	};
	
	objectFunctions._updateTouch = function(aTouchData) {
		console.log("dbm.workspace.gui.Workspace::_updateTouch");
	};
	
	objectFunctions._endTouch = function(aTouchData) {
		console.log("dbm.workspace.gui.Workspace::_endTouch");
	};
	
	objectFunctions._cancelTouch = function(aTouchData) {
		console.log("dbm.workspace.gui.Workspace::_cancelTouch");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputArea = null;
		this._graphicsUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAttributes) {
		return ClassReference._create(ClassReference, aAttributes);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference._createOnParent(ClassReference, aParentOrDocument, aAddToParent, aAttributes);
	};
	
	staticFunctions._create = function(aClass, aAttributes) {
		var newNode = (new aClass()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		return newNode;
	};
	
	staticFunctions._createOnParent = function(aClass, aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new aClass()).init();
		
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