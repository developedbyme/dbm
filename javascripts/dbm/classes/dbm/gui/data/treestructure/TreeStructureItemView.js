/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.data.treestructure.TreeStructureItemView", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.data.treestructure.TreeStructureItemView");
	//"use strict";
	
	//Self reference
	var TreeStructureItemView = dbm.importClass("dbm.gui.data.treestructure.TreeStructureItemView");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ExtendedEventProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventProperty");
	var BooleanSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.BooleanSwitchedNode");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureItemView::_init");
		
		this.superCall();
		
		this.setElementAsPositioned();
		
		this._parentTreeStructureItemView = null;
		this._treeStructureItem = null;
		this._name = this.createProperty("name", "");
		this._ownHeight = this.createProperty("ownHeight", 20);
		var firstAdditionNode = this.addDestroyableObject(AdditionNode.create(this.getProperty("y"), this._ownHeight));
		this._childYPosition = this.createProperty("childYPosition", firstAdditionNode.getProperty("outputValue"));
		this._nextYPosition = this.createProperty("nextYPosition", this._childYPosition);
		
		this._isOpen = this.createProperty("isOpen", false);
		var switchNode = this.addDestroyableObject(BooleanSwitchedNode.create(this._isOpen, GenericExtendedEventIds.OPEN, GenericExtendedEventIds.CLOSE));
		this._outputState = this.createProperty("outputState", switchNode.getProperty("outputValue"));
		this._isOpenCommands = this.addProperty("isOpenCommands", ExtendedEventProperty.create(GenericExtendedEventIds.CLOSE).changeToExternalEventController(this.getExtendedEvent()));
		this._isOpenCommands.connectInput(this._outputState);
		this._display.connectInput(this._isOpenCommands);
		this._childItems = new Array();
		
		this._nameChangedCommand = SetPropertyCommand.createCommand(this._name, GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "newValue"));
		this._nameChangedCommand.retain();
		this.addDestroyableObject(this._nameChangedCommand);
		
		return this;
	};
	
	objectFunctions.setTreeStructureItem = function(aTreeStructureItem) {
		this._treeStructureItem = aTreeStructureItem;
		
		this._name.setValue(aTreeStructureItem.getName());
		this._treeStructureItem.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NAME_CHANGED, this._nameChangedCommand);
		
		return this;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
	};
	
	objectFunctions.getChildItems = function() {
		return this._childItems;
	};
	
	objectFunctions.getParentTreeStructureItemView = function() {
		return this._parentTreeStructureItemView;
	};
	
	objectFunctions.open = function() {
		this._isOpen.setValue(true);
		this._isOpenCommands.update();
	};
	
	objectFunctions.close = function() {
		this._isOpen.setValue(false);
		this._isOpenCommands.update();
	};
	
	objectFunctions.toggleOpenClose = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureItemView::toggleOpenClose");
		
		this._isOpen.setValue(!this._isOpen.getValue());
		this._isOpenCommands.update();
	};
	
	objectFunctions._linkRegistration_addChildTreeStructureItem = function(aChild) {
		
		if(this._childItems.length === 0) {
			aChild.setPropertyInput("y", this._childYPosition);
		}
		else {
			var lastItem = this._childItems[this._childItems.length-1];
			aChild.setPropertyInput("y", lastItem.getProperty("nextYPosition"));
		}
		
		this.getProperty("nextYPosition").disconnectInput().connectInput(aChild.getProperty("nextYPosition"));
		
		this._childItems.push(aChild);
	};
	
	objectFunctions._linkRegistration_addParentTreeStructureItem = function(aParent) {
		this._parentTreeStructureItemView = aParent;
	};
	
	objectFunctions._linkRegistration_removeChildTreeStructureItem = function(aChild) {
		
		var index = ArrayFunctions.indexOfInArray(this._childItems, aChild);
		if(index === -1) {
			//METODO: error message
			return;
		}
		
		var newLength = this._childItems.length-1;
		if(index === newLength) {
			if(newLength === 0) {
				this.getProperty("nextYPosition").disconnectInput().connectInput(this._childYPosition);
			}
			else {
				this.getProperty("nextYPosition").disconnectInput().connectInput(this._childItems[newLength-1].getProperty("nextYPosition"));
			}
		}
		else {
			var nextItem = this._childItems[index+1];
			if(index === 0) {
				nextItem.getProperty("y").disconnectInput().connectInput(this._childYPosition);
			}
			else {
				var lastItem = this._childItems[index-1];
				nextItem.getProperty("y").disconnectInput().connectInput(lastItem.getProperty("nextYPosition"));
			}
		}
		
		this._childItems.splice(index, 1);
	};
	
	objectFunctions._linkRegistration_removeParentTreeStructureItem = function(aParent) {
		this._parentTreeStructureItemView = null;
	};
	
	objectFunctions.destroyChildren = function() {
		var currentArray = this._childItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[currentArrayLength-i-1];
			this._linkRegistration_removeChildTreeStructureItem(currentChild);
			currentChild._linkRegistration_removeParentTreeStructureItem(this);
			currentChild.destroy();
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		switch(aName) {
			case GenericExtendedEventIds.OPEN:
			case GenericExtendedEventIds.CLOSE:
				return true;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureItemView::performDestroy");
		
		if(this._treeStructureItem !== null) {
			this._treeStructureItem.getExtendedEvent().removeCommandFromEvent(GenericExtendedEventIds.NAME_CHANGED, this._nameChangedCommand);
		}
		
		if(this._parentTreeStructureItemView !== null) {
			this._parentTreeStructureItemView._linkRegistration_removeChildTreeStructureItem(this);
			this._linkRegistration_removeParentTreeStructureItem(this._parentTreeStructureItemView);
		}
		
		if(this._childItems !== null) {
			this.destroyChildren();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.data.treestructure.TreeStructureItemView::setAllReferencesToNull");
		
		this._name = null;
		this._childItems = null;
		this._treeStructureItem = null;
		this._isOpen = null;
		this._outputState = null;
		this._isOpenCommands = null;
		this._parentTreeStructureItemView = null;
		this._ownHeight = null;
		this._childYPosition = null;
		this._nextYPosition = null;
		this._nameChangedCommand = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_treeStructureItem":
				return false;
		}
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
});