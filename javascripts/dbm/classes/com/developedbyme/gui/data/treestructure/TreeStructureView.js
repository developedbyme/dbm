dbm.registerClass("com.developedbyme.gui.data.treestructure.TreeStructureView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.data.treestructure.TreeStructureView");
	//"use strict";
	
	//Self reference
	var TreeStructureView = dbm.importClass("com.developedbyme.gui.data.treestructure.TreeStructureView");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	//Utils
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureView::_init");
		
		this.superCall();
		
		this._treeStructure = null;
		this._itemTemplate = null;
		
		this._indentLength = this.createProperty("indentLength", 10);
		var firstIndent = this.addDestroyableObject(PropertiesHolder.create({"outputValue": 0}));
		this._indents = new Array(firstIndent);
		this._visibleItems = new Array();
		
		return this;
	};
	
	objectFunctions.setItemTemplate = function(aTemplate) {
		this._itemTemplate = aTemplate;
	};
	
	objectFunctions._getIndentForLevel = function(aLevel) {
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureView::_getIndentForLevel");
		
		if(aLevel >= this._indents.length) {
			for(var i = this._indents.length; i <= aLevel; i++) {
				this._indents.push(AdditionNode.create(this._indents[i-1].getProperty("outputValue"), this._indentLength));
			}
		}
		
		return this._indents[aLevel].getProperty("outputValue");
	};
	
	objectFunctions.setTreeStructure = function(aTreeStructure) {
		this._treeStructure = aTreeStructure;
		
		//this._createItemDisplay(this._treeStructure.getRoot(), 0, "(root)");
		this._createItemDisplaysForFullTree(this._treeStructure.getRoot(), 0, "(root)"); //MEDEBUG
	};
	
	objectFunctions._createItemDisplaysForFullTree = function(aCurrentItem, aLevel, aName) {
		this._createItemDisplay(aCurrentItem, aLevel, aName);
		
		var currentArray = aCurrentItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChildItem = currentArray[i];
			this._createItemDisplaysForFullTree(currentChildItem, aLevel+1, currentChildItem.getName());
		}
	}
	
	objectFunctions._createItemDisplay = function(aTreeStructureItem, aLevel, aName) {
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureView::_createItemDisplay");
		
		var importedTemplateElement = DomManipulationFunctions.importNode(this._itemTemplate, true, this.getHtmlCreator().ownerDocument);
		importedTemplateElement.id = null;
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(importedTemplateElement, {"name": aName, "indent": this._getIndentForLevel(aLevel), "y": 20*this._visibleItems.length});
		
		var newItem = templateResult.mainController;
		newItem.addToParent(this.getElement());
		this._visibleItems.push(newItem);
		
		return newItem;
	}
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureView::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
});