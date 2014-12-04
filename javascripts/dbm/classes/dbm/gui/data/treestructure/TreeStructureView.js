/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.data.treestructure.TreeStructureView", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.data.treestructure.TreeStructureView");
	//"use strict";
	
	//Self reference
	var TreeStructureView = dbm.importClass("dbm.gui.data.treestructure.TreeStructureView");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var DomManipulationFunctions = dbm.importClass("dbm.utils.htmldom.DomManipulationFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	//Debug
	var InteractionExtendedEventSetup = dbm.importClass("dbm.core.extendedevent.setup.InteractionExtendedEventSetup");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_init");
		
		this.superCall();
		
		this._treeStructure = null;
		this._itemTemplate = null;
		this._openId = dbm.singletons.dbmIdManager.getNewId("TreeStructureView_isOpen");
		
		this._indentLength = this.createProperty("indentLength", 10);
		var firstIndent = this.addDestroyableObject(PropertiesHolder.create({"outputValue": 0}));
		this._indents = new Array(firstIndent);
		this._destroyItemsWhenHidden = true;
		this._rootItems = new Array();
		
		return this;
	};
	
	objectFunctions.setItemTemplate = function(aTemplate) {
		this._itemTemplate = aTemplate;
	};
	
	objectFunctions._getIndentForLevel = function(aLevel) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_getIndentForLevel");
		
		if(aLevel >= this._indents.length) {
			for(var i = this._indents.length; i <= aLevel; i++) {
				this._indents.push(AdditionNode.create(this._indents[i-1].getProperty("outputValue"), this._indentLength));
			}
		}
		
		return this._indents[aLevel].getProperty("outputValue");
	};
	
	objectFunctions.setTreeStructure = function(aTreeStructure) {
		this._treeStructure = aTreeStructure;
		
		this._treeStructure.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._itemAdded, [GetVariableObject.createSelectDataCommand()]));
		
		var rootItem = this._createItemDisplay(this._treeStructure.getRoot(), 0, "(root)", null);
		this._rootItems.push(rootItem);
		//this._createItemDisplaysForFullTree(this._treeStructure.getRoot(), 0, "(root)"); //MEDEBUG
	};
	
	objectFunctions._findViewForItem = function(aTreeStructureItem, aCurrentItems) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_findViewForItem");
		
		var currentArray = aCurrentItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentItem = currentArray[i];
			if(currentItem.getTreeStructureItem() === aTreeStructureItem) {
				return currentItem;
			}
		}
		for(var i = 0; i < currentArrayLength; i++) {
			var returnValue = this._findViewForItem(aTreeStructureItem, currentArray[i].getChildItems());
			if(returnValue !== null) {
				return returnValue;
			}
		}
		return null;
	};
	
	objectFunctions._getLevelForView = function(aTreeStructureItemView) {
		var currentLevel = 0;
		var currentObject = aTreeStructureItemView.getParentTreeStructureItemView();
		var debugCounter = 0;
		while(currentObject !== null) {
			if(debugCounter++ > 1000) {
				//METODO: error message
				return -1;
			}
			currentLevel++;
			currentObject = currentObject.getParentTreeStructureItemView();
		}
		return currentLevel;
	};
	
	objectFunctions._itemAdded = function(aTreeStructureItem) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_itemAdded");
		
		var parentObject = this._findViewForItem(aTreeStructureItem.getParent(), this._rootItems);
		
		if(parentObject !== null) {
			var newLevel = this._getLevelForView(parentObject)+1;
			this._createItemDisplay(aTreeStructureItem, newLevel, aTreeStructureItem.getName(), parentObject);
		}
	};
	
	objectFunctions._createItemDisplaysForFullTree = function(aCurrentItem, aLevel, aName, aParentTreeStructureItem) {
		var newItem = this._createItemDisplay(aCurrentItem, aLevel, aName, aParentTreeStructureItem);
		
		var currentArray = aCurrentItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChildItem = currentArray[i];
			this._createItemDisplaysForFullTree(currentChildItem, aLevel+1, currentChildItem.getName(), newItem);
		}
	};
	
	objectFunctions._createChildrenForItem = function(aObject, aLevel) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_createChildrenForItem");
		//console.log(aObject, aLevel);
		
		var treeStructureItem = aObject.getTreeStructureItem();
		
		var currentArray = treeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChildItem = currentArray[i];
			this._createItemDisplay(currentChildItem, aLevel, currentChildItem.getName(), aObject);
		}
		
		//MEDEBUG
		//this._treeStructure.createItem("test", treeStructureItem);
		//treeStructureItem.setName("test2");
	};
	
	objectFunctions._removeChildrenForItem = function(aObject) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_removeChildrenForItem");
		
		aObject.destroyChildren();
	};
	
	objectFunctions._deleteItem = function(aObject) {
		
	};
	
	objectFunctions._createItemDisplay = function(aTreeStructureItem, aLevel, aName, aParentTreeStructureItem) {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::_createItemDisplay");
		
		var importedTemplateElement = DomManipulationFunctions.importNode(this._itemTemplate, true, this.getHtmlCreator().ownerDocument);
		importedTemplateElement.id = null;
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(importedTemplateElement, {"indent": this._getIndentForLevel(aLevel)});
		
		var newItem = templateResult.mainController;
		newItem.addToParent(this.getElement());
		newItem.setTreeStructureItem(aTreeStructureItem);
		newItem.getProperty("name").setValue(aName);
		
		if(aParentTreeStructureItem !== null) {
			aParentTreeStructureItem._linkRegistration_addChildTreeStructureItem(newItem);
			newItem._linkRegistration_addParentTreeStructureItem(aParentTreeStructureItem);
		}
		
		if(aTreeStructureItem.hasAttribute(this._openId)) {
			if(aTreeStructureItem.getAttribute(this._openId)) {
				newItem.open();
				this._createChildrenForItem(newItem, aLevel+1);
			}
		}
		else {
			aTreeStructureItem.setAttribute(this._openId, false);
		}
		
		newItem.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(aTreeStructureItem, aTreeStructureItem.changeAttribute, [this._openId, true]));
		newItem.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(aTreeStructureItem, aTreeStructureItem.changeAttribute, [this._openId, false]));
		
		if(this._destroyItemsWhenHidden) {
			newItem.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this._createChildrenForItem, [newItem, aLevel+1]));
			newItem.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._removeChildrenForItem, [newItem]));
		}
		
		//MEDEBUG
		InteractionExtendedEventSetup.addClickEvents(newItem.getExtendedEvent(), newItem.getElement(), true);
		newItem.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(newItem, newItem.toggleOpenClose, []));
		
		
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.ITEM_CREATED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.ITEM_CREATED, newItem);
		}
		
		return newItem;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.ITEM_CREATED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureView::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
});