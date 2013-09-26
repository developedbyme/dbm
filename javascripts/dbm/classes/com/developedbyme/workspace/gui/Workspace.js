dbm.registerClass("com.developedbyme.workspace.gui.Workspace", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.Workspace");
	//"use strict";
	
	var Workspace = dbm.importClass("com.developedbyme.workspace.gui.Workspace");
	
	var TouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchOrMouseDetector");
	var GenericClickTool = dbm.importClass("com.developedbyme.workspace.gui.tools.generic.GenericClickTool");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.Workspace::_init");
		
		this.superCall();
		
		this._currentTool = GenericClickTool.create();
		this._availableTools = new Array();
		this._currentSelection = new Array();
		this._isInteracting = false;
		this._parts = TreeStructure.create();
		this._parts.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._newTreeStructureAdded, [GetVariableObject.createSelectDataCommand()]));
		
		this._touchDetector = (new TouchOrMouseDetector()).init();
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._startTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, CallFunctionCommand.createCommand(this, this._updateTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._endTouch, [GetVariableObject.createSelectDataCommand()]));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CANCEL, CallFunctionCommand.createCommand(this, this._cancelTouch, [GetVariableObject.createSelectDataCommand()]));
		
		this._workspaceAreaRectangleGenerator = RectangleFromValuesNode.create(0, 0, 100, 100);
		
		this._newTreeStructureAdded(this._parts.getRoot());
		this._parts.getRoot().getAttribute("properties").setPropertyInput("inputArea", this._workspaceAreaRectangleGenerator.getProperty("outputRectangle"));
		this._parts.getRoot().getAttribute("properties").setPropertyInput("parent", this._element);
		
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
		//console.log("com.developedbyme.workspace.gui.Workspace::addPart");
		
		var treeStructureItem = this._parts.getItemByPath(aPath);
		aPart.setTreeStructureItem(treeStructureItem);
	};
	
	objectFunctions.addToSelection = function(aObject) {
		console.log("com.developedbyme.workspace.gui.Workspace::addToSelection");
	};
	
	objectFunctions.removeFromSelection = function(aObject) {
		console.log("com.developedbyme.workspace.gui.Workspace::removeFromSelection");
	};
	
	objectFunctions.setSelection = function(aObjectsArray) {
		console.log("com.developedbyme.workspace.gui.Workspace::setSelection");
	};
	
	objectFunctions._newTreeStructureAdded = function(aTreeStructureItem) {
		//console.log("com.developedbyme.workspace.gui.Workspace::_newTreeStructureAdded");
		//console.log(aTreeStructureItem);
		
		var propertiesHolder = PropertiesHolder.create();
		aTreeStructureItem.setAttribute("properties", propertiesHolder);
		propertiesHolder.createProperty("inputArea", null).setAlwaysUpdateFlow();
		propertiesHolder.createProperty("defaultChildArea", null).setAlwaysUpdateFlow();
		propertiesHolder.createProperty("parent", null);
		propertiesHolder.createProperty("defaultChildParent", null);
		
		propertiesHolder.setPropertyInput("defaultChildParent", propertiesHolder.getProperty("parent"));
		propertiesHolder.setPropertyInput("defaultChildArea", propertiesHolder.getProperty("inputArea"));
		
		var parent = aTreeStructureItem.getParent();
		if(parent !== null) {
			var parentPropertiesHolder = parent.getAttribute("properties");
			propertiesHolder.setPropertyInput("parent", parentPropertiesHolder.getProperty("defaultChildParent"));
			propertiesHolder.setPropertyInput("inputArea", parentPropertiesHolder.getProperty("defaultChildArea"));
		}
	};
	
	objectFunctions._startTouch = function(aTouchData) {
		console.log("com.developedbyme.workspace.gui.Workspace::_startTouch");
		var result = this._currentTool.startTouch(this, this._currentSelection);
		console.log(result);
		
		if(result) this._touchDetector.stopEvent();
	};
	
	objectFunctions._updateTouch = function(aTouchData) {
		console.log("com.developedbyme.workspace.gui.Workspace::_updateTouch");
	};
	
	objectFunctions._endTouch = function(aTouchData) {
		console.log("com.developedbyme.workspace.gui.Workspace::_endTouch");
	};
	
	objectFunctions._cancelTouch = function(aTouchData) {
		console.log("com.developedbyme.workspace.gui.Workspace::_cancelTouch");
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