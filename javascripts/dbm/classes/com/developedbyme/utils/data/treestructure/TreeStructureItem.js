/**
 * A tree structure item.
 *
 * @authur	mattiase
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.utils.data.treestructure.TreeStructureItem", "com.developedbyme.utils.data.retainableobjects.RetainableDataHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	var TreeStructureItemTypes = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemTypes");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructureItem");
		
		this.superCall();
		
		this._children = (new NamedArray()).init();
		this._children.ownsObjects = false;
		
		this._type = TreeStructureItemTypes.ITEM;
		this._name = null;
		this._parent = null;
		this._root = null;
		
		return this;
	} //End function TreeStructureItem
	
	/**
	 * Gets the name of the item.
	 */
	objectFunctions.getName = function() {
		//console.log("getName");
		return this._name;
	} //End function getName
	
	/**
	 * Sets the name of the item.
	 */
	objectFunctions.setName = function(aName) {
		//console.log("set name");
		if(this._parent != null) {
			this._parent.changeChildName(this, aName);
		}
		else {
			this._linkRegistration_setName(aName);
		}
	} //End function set name
	
	/**
	 * Gets the path of the item.
	 */
	objectFunctions.getPath = function() {
		//console.log("getPath");
		var currentItem = this;
		var returnArray = new Array();
		while(currentItem != null) {
			returnArray.unshift(currentItem.getName());
			currentItem = currentItem.getParent();
		}
		return returnArray.join("/");
	} //End function getPath
	
	/**
	 * Gets the type of the item.
	 */
	objectFunctions.getType = function() {
		//console.log("getType");
		return this._type;
	} //End function getType
	
	/**
	 * Gets the parent of this item.
	 */
	objectFunctions.getParent = function() {
		//console.log("getParent");
		return this._parent;
	} //End function getParent
	
	/**
	 * Gets the root of this tree structure.
	 */
	objectFunctions.getRoot = function() {
		//console.log("getRoot");
		return this._root;
	} //End function getRoot
	
	/**
	 * Gets the item is a link or not
	 */
	objectFunctions.isLink = function() {
		//console.log("isLink");
		return (this._type == TreeStructureItemTypes.LINK);
	} //End function isLink
	
	/**
	 * Gets the names of the childs.
	 */
	objectFunctions.getChildNames = function() {
		//console.log("getChildNames");
		return this._children.getNamesArray();
	} //End function getChildNames
	
	/**
	 * Gets the children.
	 */
	objectFunctions.getChildren = function() {
		//console.log("getChildren");
		return this._children.getObjectsArray();
	} //End function getChildren
	
	
	/**
	 * Sets the name of the item.
	 */
	objectFunctions._linkRegistration_setName = function(aName) {
		//console.log("setName");
		this._name = aName;
		
		return this;
	} //End function setName
	
	/**
	 * Sets the parent of this item.
	 */
	objectFunctions._linkRegistration_setParent = function(aParent) {
		//console.log("setParent");
		if(this._parent != null) {
			this._parent.removeChild(this);
		}
		this._parent = aParent;
		this._root = aParent.getRoot();
	} //End function setParent
	
	/**
	 * Sets the root
	 */
	objectFunctions._internalFunctionality_setRoot = function(aRoot) {
		//console.log("setRoot");
		this._root = aRoot;
	} //End function setRoot
	
	/**
	 * Removes the parent of this item.
	 */
	objectFunctions._linkRegistration_removeParent = function() {
		//console.log("removeParent");
		this._parent = null;
		this._root = null;
	} //End function removeParent
	
	/**
	 * Adds a child.
	 */
	objectFunctions.addChild = function(aItem) {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructureItem::addChild");
		//console.log(aItem);
		aItem.retain();
		aItem._linkRegistration_setParent(this);
		var childName = aItem.getName();
		if(this._children.select(childName)) {
			this._children.currentSelectedItem.releaseAndDestroy();
			this._children.removeObject(childName);
		}
		this._children.addObject(childName, aItem);
	} //End function addChild
	
	/**
	 * Removes a child.
	 */
	objectFunctions.removeChild = function(aItem) {
		//console.log("removeChild");
		var childName = this._children.identifyObject(aItem);
		if(childName != null) {
			aItem._linkRegistration_removeParent();
			aItem.releaseAndDestroy();
			this._children.removeObject(childName);
		}
	} //End function removeChild
	
	/**
	 * Changes the name of a child.
	 */
	objectFunctions.changeChildName = function(aItem, aNewName) {
		//console.log("changeChildName");
		var childName = this._children.identifyObject(aItem);
		if(childName != null) {
			
			this._children.removeObject(childName);
			aItem._linkRegistration_setName(aNewName);
			this._children.addObject(aNewName, aItem);
			
		}
	} //End function changeChildName
	
	/**
	 * Gets a child by it's name.
	 */
	objectFunctions.getChildByName = function(aName) {
		//console.log("getChildByName");
		if(this._children.select(aName)) {
			return this._children.currentSelectedItem;
		}
		return null;
	} //End function getChildByName
	
	/**
	 * Resolves a path from this item.
	 */
	objectFunctions.resolvePath = function(aPath) {
		//console.log("resolvePath");
		return aPath;
	} //End function resolvePath
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aTabString, aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		console.log(aTabString + this.toString() + "\n");
		
		var newTabString = aTabString + " ";
		
		this.debugTraceChildren(newTabString, aResolveLinksLevel);
	} //End function debugTraceStructure
	
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
	} //End function debugTraceChildren
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this._name);
		aReturnArray.push("type: " + this._type);
	}
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		
		if(this._parent != null) {
			this._parent.removeChild(this);
		}
		if(this._children) {
			ClassReference.releaseAndDestroyArrayIfExists(this._children.objectsArray);
		}
		ClassReference.destroyIfExists(this._children);
		
		this.superCall();
	}
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parent = null;
		this._root = null;
		this._children = null;
		
		this.superCall();
	}
	
	/**
	 * Creates a new item.
	 */
	staticFunctions.create= function(aName) {
		//console.log("create");
		var newItem = (new TreeStructureItem()).init();
		newItem.setName(aName);
		return newItem;
	}; //End function create
});