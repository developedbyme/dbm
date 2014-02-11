dbm.registerClass("com.developedbyme.gui.data.treestructure.TreeStructureItemView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.data.treestructure.TreeStructureItemView");
	//"use strict";
	
	//Self reference
	var TreeStructureItemView = dbm.importClass("com.developedbyme.gui.data.treestructure.TreeStructureItemView");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureItemView::_init");
		
		this.superCall();
		
		this.setElementAsPositioned();
		
		this._parentTreeStructureItemView = null;
		this._treeStructureItem = null;
		this._ownHeight = this.createProperty("ownHeight", 20);
		var firstAdditionNode = this.addDestroyableObject(AdditionNode.create(this.getProperty("y"), this._ownHeight));
		this._childYPosition = this.createProperty("childYPosition", firstAdditionNode.getProperty("outputValue"));
		this._nextYPosition = this.createProperty("nextYPosition", this._childYPosition);
		
		this._isOpen = this.createProperty("isOpen", false);
		var switchNode = this.addDestroyableObject(BooleanSwitchedNode.create(this._isOpen, GenericExtendedEventIds.OPEN, GenericExtendedEventIds.CLOSE));
		this._isOpenCommands = this.addProperty("isOpenCommands", ExtendedEventProperty.create(this._objectProperty, GenericExtendedEventIds.CLOSE).changeToExternalEventController(this.getExtendedEvent()));
		this._isOpenCommands.connectInput(switchNode.getProperty("outputValue"));
		this._updateFunctions.getObject("display").addInputConnection(this._isOpenCommands);
		this._childItems = new Array();
		
		return this;
	};
	
	objectFunctions.setTreeStructureItem = function(aTreeStructureItem) {
		this._treeStructureItem = aTreeStructureItem;
		
		return this;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
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
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureItemView::toggleOpenClose");
		
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
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureItemView::performDestroy");
		
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
		//console.log("com.developedbyme.gui.data.treestructure.TreeStructureItemView::setAllReferencesToNull");
		
		this._childItems = null;
		this._treeStructureItem = null;
		this._isOpen = null;
		this._isOpenCommands = null;
		this._parentTreeStructureItemView = null;
		this._ownHeight = null;
		this._childYPosition = null;
		this._nextYPosition = null;
		
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