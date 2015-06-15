/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A tree structure item.
 */
dbm.registerClass("dbm.utils.data.treestructure.TreeStructureItem", "dbm.utils.data.retainableobjects.RetainableDataHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.treestructure.TreeStructureItem");
	//"use strict";
	
	//Self reference
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ExtendedEventController = dbm.importClass("dbm.core.extendedevent.ExtendedEventController");
	
	//Utils
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Constants
	var TreeStructureItemTypes = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemTypes");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.treestructure.TreeStructureItem::_init");
		
		this.superCall();
		
		this._extendedEvent = null;
		this._children = NamedArray.create(false);
		
		this._type = TreeStructureItemTypes.ITEM;
		this._name = null;
		this._parent = null;
		this._root = null;
		this._attributes = null;
		
		return this;
	}; //End function _init
	
	/**
	 * Interface to use extended event whithout inheriting from ExtendedEventBaseObject.
	 *
	 * @return	ExtendedEventController		The extended event controller for this object. 
	 */
	objectFunctions.getExtendedEvent = function() {
		if(this._extendedEvent === null) {
			this._extendedEvent = ExtendedEventController.create(this);
			this.addDestroyableObject(this._extendedEvent);
		}
		
		return this._extendedEvent;
	};
	
	/**
	 * Internal functionality to get all the attributes.
	 *
	 * @return	NamedArray	The attributes. Null if there are no attributes.
	 */
	objectFunctions._internalFunctionality_getAttributes = function() {
		return this._attributes;
	}; //End function _internalFunctionality_getAttributes
	
	/**
	 * Gets the name of the item.
	 *
	 * @return	String	The name of this item.
	 */
	objectFunctions.getName = function() {
		//console.log("getName");
		return this._name;
	}; //End function getName
	
	/**
	 * Sets the name of the item.
	 *
	 * @param	aName	The new name of this item.
	 */
	objectFunctions.setName = function(aName) {
		//console.log("set name");
		if(this._parent !== null) {
			this._parent.changeChildName(this, aName);
		}
		else {
			this._linkRegistration_setName(aName);
		}
	}; //End function setName
	
	/**
	 * Gets an attribute on this item.
	 *
	 * @param	aName	String	The name of the attribute.
	 *
	 * @return	*	The value of the attribute. Null if attribute doesn't exist.
	 */
	objectFunctions.getAttribute = function(aName) {
		//console.log("dbm.utils.data.treestructure.TreeStructureItem::getAttribute");
		//console.log(aName);
		
		if(this._attributes === null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "getAttribute", "Item doesn't have any attributes. Can't get " + aName);
			
			return null;
		}
		if(this._attributes.select(aName)) {
			return this._attributes.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "getAttribute", "Item doesn't have attribute " + aName);
		
		return null;
	};
	
	/**
	 * Sets an attribute on this item.
	 *
	 * @param	aName	String	The name of the attribute.
	 * @param	aValue	*		The value of the attribute.
	 */
	objectFunctions.setAttribute = function(aName, aValue) {
		if(this._attributes === null) {
			this._attributes = NamedArray.create(false);
			this.addDestroyableObject(this._attributes);
		}
		this._attributes.addObject(aName, aValue);
	};
	
	/**
	 * Changes the value of an attribute on this item.
	 *
	 * @param	aName	String	The name of the attribute.
	 * @param	aValue	*		The new value of the attribute.
	 */
	objectFunctions.changeAttribute = function(aName, aValue) {
		if(this._attributes === null) {
			this._attributes = NamedArray.create(false);
			this.addDestroyableObject(this._attributes);
		}
		if(this._attributes.hasObject(aName)) {
			this._attributes.removeObject(aName);
		}
		this._attributes.addObject(aName, aValue);
	};
	
	objectFunctions.hasAttribute = function(aName) {
		return (this._attributes !== null && this._attributes.hasObject(aName));
	};
	
	objectFunctions.getInheritedAttribute = function(aName) {
		var currentItem = this;
		var debugCounter = 0;
		while(currentItem !== null) {
			if(debugCounter++ > 1000) {
				//METODO: error message
				return null;
			}
			if(currentItem.hasAttribute(aName)) {
				return currentItem.getAttribute(aName);
			}
			
			currentItem = currentItem.getParent();
		}
		//METODO: warning message
		return null;
	};
	
	/**
	 * Gets the path of the item.
	 */
	objectFunctions.getPath = function() {
		//console.log("getPath");
		var currentItem = this;
		var returnArray = new Array();
		while(currentItem !== null) {
			returnArray.unshift(currentItem.getName());
			currentItem = currentItem.getParent();
		}
		return returnArray.join("/");
	}; //End function getPath
	
	/**
	 * Gets the type of the item.
	 */
	objectFunctions.getType = function() {
		//console.log("getType");
		return this._type;
	}; //End function getType
	
	/**
	 * Gets the parent of this item.
	 */
	objectFunctions.getParent = function() {
		//console.log("getParent");
		return this._parent;
	}; //End function getParent
	
	/**
	 * Gets the root of this tree structure.
	 */
	objectFunctions.getRoot = function() {
		//console.log("getRoot");
		return this._root;
	}; //End function getRoot
	
	/**
	 * Gets the item is a link or not
	 */
	objectFunctions.isLink = function() {
		//console.log("isLink");
		return (this._type === TreeStructureItemTypes.LINK);
	}; //End function isLink
	
	/**
	 * Gets the names of the childs.
	 */
	objectFunctions.getChildNames = function() {
		//console.log("getChildNames");
		return this._children.getNamesArray();
	}; //End function getChildNames
	
	/**
	 * Gets the children.
	 */
	objectFunctions.getChildren = function() {
		//console.log("getChildren");
		return this._children.getObjectsArray();
	}; //End function getChildren
	
	/**
	 * Gets the number of children directly 1 level under this item.
	 *
	 * @return	Number	The number of children.
	 */
	objectFunctions.getNumberOfChildren = function() {
		return this._children.getObjectsArray().length;
	};
	
	/**
	 * Sets the name of the item.
	 */
	objectFunctions._linkRegistration_setName = function(aName) {
		//console.log("setName");
		var oldName = this._name;
		this._name = aName;
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.NAME_CHANGED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.NAME_CHANGED, {"oldValue": oldName, "newValue": aName});
		}
		
		return this;
	}; //End function setName
	
	/**
	 * Sets the parent of this item.
	 */
	objectFunctions._linkRegistration_setParent = function(aParent) {
		//console.log("setParent");
		if(this._parent !== null) {
			this._parent.removeChild(this);
		}
		this._parent = aParent;
		this._internalFunctionality_setRoot(aParent.getRoot());
	}; //End function setParent
	
	/**
	 * Sets the root
	 */
	objectFunctions._internalFunctionality_setRoot = function(aRoot) {
		//console.log("_internalFunctionality_setRoot");
		this._root = aRoot;
		
		var currentArray = this._children.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			currentObject._internalFunctionality_setRoot(aRoot);
		}
	}; //End function _internalFunctionality_setRoot
	
	/**
	 * Removes the parent of this item.
	 */
	objectFunctions._linkRegistration_removeParent = function() {
		//console.log("removeParent");
		this._parent = null;
		this._internalFunctionality_setRoot(null);
	}; //End function _linkRegistration_removeParent
	
	/**
	 * Adds a child.
	 */
	objectFunctions.addChild = function(aItem) {
		//console.log("dbm.utils.data.treestructure.TreeStructureItem::addChild");
		//console.log(aItem);
		aItem.retain();
		aItem._linkRegistration_setParent(this);
		var childName = aItem.getName();
		if(this._children.select(childName)) {
			this._children.currentSelectedItem.releaseAndDestroy();
			this._children.removeObject(childName);
		}
		this._children.addObject(childName, aItem);
	}; //End function addChild
	
	/**
	 * Removes a child.
	 */
	objectFunctions.removeChild = function(aItem) {
		//console.log("removeChild");
		var childName = this._children.identifyObject(aItem);
		if(childName !== null) {
			aItem._linkRegistration_removeParent();
			aItem.releaseAndDestroy();
			this._children.removeObject(childName);
		}
	}; //End function removeChild
	
	/**
	 * Changes the name of a child.
	 */
	objectFunctions.changeChildName = function(aItem, aNewName) {
		//console.log("changeChildName");
		var childName = this._children.identifyObject(aItem);
		if(childName !== null) {
			
			this._children.removeObject(childName);
			aItem._linkRegistration_setName(aNewName);
			this._children.addObject(aNewName, aItem);
			
		}
	}; //End function changeChildName
	
	/**
	 * Gets a child by it's name.
	 */
	objectFunctions.getChildByName = function(aName) {
		//console.log("getChildByName");
		if(this._children.select(aName)) {
			return this._children.currentSelectedItem;
		}
		return null;
	}; //End function getChildByName
	
	objectFunctions.getByPath = function(aPath) {
		return this._root.getItemByPath(aPath, this);
	};
	
	/**
	 * Resolves a path from this item.
	 */
	objectFunctions.resolvePath = function(aPath) {
		//console.log("resolvePath");
		return aPath;
	}; //End function resolvePath
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aTabString, aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		console.log(aTabString + this.toString() + "\n");
		
		var newTabString = aTabString + " ";
		
		this.debugTraceChildren(newTabString, aResolveLinksLevel);
	}; //End function debugTraceStructure
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceChildren = function(aTabString, aResolveLinksLevel) {
		
		var currentArray = this._children.getObjectsArray();
		var theLength = currentArray.length;
		for (var i = 0; i < theLength; i++) {
			var currentChild = currentArray[i];
			currentChild.debugTraceStructure(aTabString, aResolveLinksLevel);
		}
	}; //End function debugTraceChildren
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this._name);
		aReturnArray.push("type: " + this._type);
		if(this.data !== null && this.data !== undefined) {
			aReturnArray.push("data: " + this.data.toString());
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.NAME_CHANGED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		
		if(this._parent !== null) {
			this._parent.removeChild(this);
		}
		if(this._children) {
			//METODO: should we not destroy the whole children instead of going to the array?
			ClassReference.releaseAndDestroyArrayIfExists(this._children.getObjectsArray());
		}
		
		if(this.ownsData) {
			ClassReference.softDestroyIfExists(this.data);
		}
		
		ClassReference.destroyIfExists(this._children);
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_root":
			case "_parent":
				return false;
		}
		return this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parent = null;
		this._root = null;
		this._children = null;
		this._extendedEvent = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aName	String	The name for the new object.
	 *
	 * @return	Property	The newly created object.
	 */
	staticFunctions.create = function(aName) {
		//console.log("dbm.utils.data.treestructure.TreeStructureItem::create");
		var newItem = (new TreeStructureItem()).init();
		newItem.setName(aName);
		return newItem;
	}; //End function create
});