/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A tree structure.
 */
dbm.registerClass("com.developedbyme.utils.data.treestructure.TreeStructure", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.treestructure.TreeStructure");
	//"use strict";
	
	//Self reference
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	
	//Error report
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructure::_init");
		
		this.superCall();
		
		this.createMissingItems = true;
		this.ownsData = false;
		
		this._root = TreeStructureItem.create("");
		this._root._internalFunctionality_setRoot(this);
		
		this._itemClass = TreeStructureItem;
		
		return this;
	}; //End function _init
	
	/**
	 * Gets the root of the tree structure.
	 */
	objectFunctions.getRoot = function() {
		return this._root;
	}; //End function getRoot
	
	/**
	 * Adds an item.
	 */
	objectFunctions.addItem = function(aItem, aPath, aBaseItem) {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructure::addItem");
		//sconsole.log(aItem, aPath, aBaseItem);
		
		var lastSlashIndex = aPath.lastIndexOf("/");
		if(lastSlashIndex !== -1) {
			aPath = aPath.substring(0, lastSlashIndex);
		}
		
		var currentItem = this.getItemByPath(aPath, aBaseItem);
		
		currentItem.addChild(aItem);
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.ITEM_ADDED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.ITEM_ADDED, aItem);
		}
	}; //End function addItem
	
	/**
	 * Creates a new item
	 */
	objectFunctions.createItem = function(aName, aParent, aForce) {
		//console.log("createItem");
		
		aForce = VariableAliases.valueWithDefault(aForce, false);
		
		if(!this.createMissingItems && !aForce) return null;
		var newItem = this._itemClass.create(aName);
		aParent.addChild(newItem);
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.ITEM_CREATED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.ITEM_CREATED, newItem);
		}
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.ITEM_ADDED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.ITEM_ADDED, newItem);
		}
		
		return newItem;
	}; //End function createItem
	
	/**
	 * Gets an item by path.
	 */
	objectFunctions.getItemByPath = function(aPath, aBaseItem) {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructure::getItemByPath");
		//console.log(aPath, aBaseItem);
		
		aBaseItem = VariableAliases.valueWithDefault(aBaseItem, null);
		
		var currentItem = aBaseItem;
		if(currentItem === null) {
			currentItem = this._root;
		}
		var currentArray;
		if(aPath.charAt(0) === "/") {
			currentItem = this._root;
			currentArray = aPath.substring(1, aPath.length).split("/");
		}
		else {
			currentArray = aPath.split("/");
		}
		
		var theLength = currentArray.length;
		while(theLength > 0) {
			var currentPathPart = decodeURIComponent(currentArray.shift());
			theLength--;
			switch(currentPathPart) {
				case ".":
					break;
				case "..":
					currentItem = currentItem.getParent();
					break;
				default:
					var newItem = currentItem.getChildByName(currentPathPart);
					if(newItem === null) {
						newItem = this.createItem(currentPathPart, currentItem);
						if(newItem === null) {
							return null;
						}
					}
					if(newItem.isLink()) {
						var newPath = newItem.resolvePath(currentArray.join("/"));
						return this.getItemByPath(newPath, currentItem);
					}
					currentItem = newItem;
					break;
			}
		}
		return currentItem;
	}; //End function getItemByPath
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.ITEM_ADDED:
			case GenericExtendedEventIds.ITEM_CREATED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		
		aResolveLinksLevel = VariableAliases.valueWithDefault(aResolveLinksLevel, 10);
		
		this._root.debugTraceStructure("", aResolveLinksLevel);
	}; //End function debugTraceStructure
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this._root);
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._root = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructure::create");
		var newTreeStructure = (new ClassReference()).init();
		
		return newTreeStructure;
	};
});