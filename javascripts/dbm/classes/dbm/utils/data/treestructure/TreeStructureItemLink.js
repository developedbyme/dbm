/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A tree strucure item link.
 */
dbm.registerClass("dbm.utils.data.treestructure.TreeStructureItemLink", "dbm.utils.data.treestructure.TreeStructureItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.treestructure.TreeStructureItemLink");
	//"use strict";
	
	var TreeStructureItemLink = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemLink");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var TreeStructureItemTypes = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.treestructure.TreeStructureItemLink::_init");
		
		this.superCall();
		
		this._type = TreeStructureItemTypes.LINK;
		this.link = null;
		
		return this;
	}; //End function _init
	
	/**
	 * Adds a child.
	 */
	objectFunctions.addChild = function(aItem) {
		//console.log("addChild");
		
		var linkedItem =  this._root.getItemByPath(this.link, this);
		linkedItem.addChild(aItem);
	}; //End function addChild
	
	/**
	 * Removes a child.
	 */
	objectFunctions.removeChild = function(aItem) {
		//console.log("removeChild");
		
		var linkedItem =  this._root.getItemByPath(this.link, this);
		linkedItem.removeChild(aItem);
	}; //End function removeChild
	
	/**
	 * Changes the name of a child.
	 */
	objectFunctions.changeChildName = function(aItem, aNewName) {
		//console.log("changeChildName");
		var linkedItem =  this._root.getItemByPath(this.link, this);
		linkedItem.changeChildName(aItem, aNewName);
	}; //End function changeChildName
	
	/**
	 * Gets a child by it's name.
	 */
	objectFunctions.getChildByName = function(aName) {
		//console.log("getChildByName");
		var linkedItem =  this._root.getItemByPath(this.link, this);
		return linkedItem.getChildByName(aName);
	}; //End function getChildByName
	
	/**
	 * Resolves a path from this item.
	 */
	objectFunctions.resolvePath = function(aPath) {
		//console.log("resolvePath");
		if(VariableAliases.isNull(aPath)) {
			return this.link;
		}
		return this.link + "/" + aPath;
	}; //End function resolvePath
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aTabString, aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		console.log(aTabString + this.toString() + "\n");
		
		var newTabString = aTabString + " ";
		
		if(aResolveLinksLevel !== 0) {
			var newLevel;
			if(aResolveLinksLevel > 0) {
				newLevel = aResolveLinksLevel-1;
			}
			else {
				newLevel = aResolveLinksLevel;
			}
			
			var linkedItem =  this._root.getItemByPath(this.link, this._parent);
			
			linkedItem.debugTraceChildren(newTabString, newLevel);
		}
	}; //End function debugTraceStructure
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("link: " + this.link);
	};
	
	/**
	 * Creates a new link.
	 */
	staticFunctions.create = function(aName, aLink) {
		//console.log("create");
		var newItem = (new TreeStructureItemLink()).init();
		newItem.setName(aName);
		newItem.link = aLink;
		return newItem;
	}; //End function create
});