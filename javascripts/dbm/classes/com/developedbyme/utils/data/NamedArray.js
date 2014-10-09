/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An array where all entries also have an identifier.
 */
dbm.registerClass("com.developedbyme.utils.data.NamedArray", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.NamedArray");
	//"use strict";
	
	//Self reference
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.NamedArray::_init");
		
		this.superCall();
		
		this._objectsObject = ClassReference._createObject();
		this._objectsArray = ClassReference._createArray();
		this._namesArray = ClassReference._createArray();
		
		this.ownsObjects = false;
		
		this.currentSelectedItem = null;
		
		return this;
	};
	
	/**
	 * Gets the objects as an array.
	 *
	 * @return	Array	The array containing all the objects.
	 */
	objectFunctions.getObjectsArray = function() {
		return this._objectsArray;
	};
	
	/**
	 * Gets an object that has all the records set on it.
	 *
	 * @return	Object	The accosiative array of all the values.
	 */
	objectFunctions.getObjectsObject = function() {
		return this._objectsObject;
	};
	
	/**
	 * Gets the names of objects in this array.
	 *
	 * @return	Array	The array containing all the names.
	 */
	objectFunctions.getNamesArray = function() {
		return this._namesArray;
	};
	
	/**
	 * Adds an object to this array. It replaces the object with the same name if it exists.
	 *
	 * @param	aName	String	The name of the object.
	 * @param	aObject	*		The object to store.
	 */
	objectFunctions.addObject = function(aName, aObject) {
		if(!VariableAliases.isSet(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addObject", "Name is null for object" + StringFunctions.convertObjectToString(aObject) + ".");
			return;
		}
		if(VariableAliases.isSet(this._objectsObject[aName])) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addObject", "Object " + aName + " (" + StringFunctions.convertObjectToString(this._objectsObject[aName]) + ") already exists, replacing with " + StringFunctions.convertObjectToString(aObject) + ".");
			this.removeObject(aName);
		}
		this._objectsObject[aName] = aObject;
		this._objectsArray.push(aObject);
		this._namesArray.push(aName);
	};
	
	/**
	 * Replaces an object in this array. It adds it if no object exists.
	 *
	 * @param	aName	String	The name of the object.
	 * @param	aObject	*		The object to store.
	 */
	objectFunctions.replaceObject = function(aName, aObject) {
		if(!VariableAliases.isSet(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "replaceObject", "Name is null for object" + StringFunctions.convertObjectToString(aObject) + ".");
			return;
		}
		if(VariableAliases.isSet(this._objectsObject[aName])) {
			this.removeObject(aName);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "replaceObject", "Object " + aName + " (" + StringFunctions.convertObjectToString(this._objectsObject[aName]) + ") doesn't exist.");
		}
		this._objectsObject[aName] = aObject;
		this._objectsArray.push(aObject);
		this._namesArray.push(aName);
	};
	
	/**
	 * Adds an object to the beginning of this array. It replaces the object with the same name if it exists.
	 *
	 * @param	aName	String	The name of the object.
	 * @param	aObject	*		The object to store.
	 */
	objectFunctions.addObjectToBeginning = function(aName, aObject) {
		if(!VariableAliases.isSet(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addObject", "Name is null for object" + StringFunctions.convertObjectToString(aObject) + ".");
			return;
		}
		if(VariableAliases.isSet(this._objectsObject[aName])) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addObject", "Object " + aName + " (" + StringFunctions.convertObjectToString(this._objectsObject[aName]) + ") already exists, replacing with " + StringFunctions.convertObjectToString(aObject) + ".");
			this.removeObject(aName);
		}
		this._objectsObject[aName] = aObject;
		this._objectsArray.unshift(aObject);
		this._namesArray.unshift(aName);
	};
	
	/**
	 * Selects an object in this array. Can later be accessed with currentSelectedItem.
	 *
	 * @param	aName	String	The anme of the object to select.
	 *
	 * @return	Boolean		True if the object exists.
	 */
	objectFunctions.select = function(aName) {
		if(!VariableAliases.isSet(this._objectsObject[aName])) {
			this.currentSelectedItem = null;
			return false;
		}
		this.currentSelectedItem = this._objectsObject[aName];
		return true;
	};
	
	/**
	 * Checks if an object exists for a name.
	 *
	 * @param	aName	String	The name of the object.
	 *
	 * @return	Boolean		True if the object exists.
	 */
	objectFunctions.hasObject = function(aName) {
		return (VariableAliases.isSet(this._objectsObject[aName]));
	};
	
	/**
	 * Checks if this array has all objects in a list.
	 *
	 * @param	aNamesArray		Array<String>	The list of names to check for.
	 *
	 * @return	Boolean		True if all objects exist in this array.
	 */
	objectFunctions.hasObjects = function(aNamesArray) {
		var currentArray = aNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(!this.hasObject(currentArray[i])) return false;
		}
		return true;
	};
	
	/**
	 * Gets an object in this array.
	 *
	 * @param	aName	String	The name of the object to get.
	 *
	 * @return	*	The object that corresponds to the given name. Null if no object has that name.
	 */
	objectFunctions.getObject = function(aName) {
		//console.log("com.developedbyme.utils.data.NamedArray::getObject");
		if(this._objectsObject[aName] === undefined) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "getObject", "Object " + aName + " doesn't exist.");
			return null;
		}
		return this._objectsObject[aName];
	};
	
	/**
	 * Removes an object from this array.
	 *
	 * @param	aName	String	The name of the object to remove.
	 */
	objectFunctions.removeObject = function(aName) {
		if(this._objectsObject[aName] === undefined) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MAJOR, this, "removeObject", "Object " + aName + " doesn't exist.");
			return;
		}
		var currentObject = this._objectsObject[aName];
		var currentArray = this._objectsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			if(currentArray[i] === currentObject) {
				currentArray.splice(i, 1);
				delete this._objectsObject[aName];
				break;
			}
		}
		var nameIndex = ArrayFunctions.indexOfInArray(this._namesArray, aName);
		if(nameIndex !== -1) {
			this._namesArray.splice(nameIndex, 1);
		}
		
		if(this.currentSelectedItem === currentObject) {
			this.currentSelectedItem = null;
		}
	};
	
	/**
	 * Makes a copy of this array.
	 *
	 * @return	NamedArray	The copy of this array.
	 */
	objectFunctions.copy = function() {
		var copiedNamedArray = (new NamedArray()).init();
		
		var currentArray = this._objectsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			copiedNamedArray.addObject(this.identifyObject(currentArray[i]), currentArray[i]);
		}
		return copiedNamedArray;
	};
	
	/**
	 * Identifies the name of an object in this array. The first matching object if the object occurs multiple times.
	 *
	 * @param	aObject		*	The object to identify.
	 *
	 * @return	String	The name of the first matching record. Null if it's not found.
	 */
	objectFunctions.identifyObject = function(aObject) {
		for(var objectName in this._objectsObject) {
			if(this._objectsObject[objectName] === aObject) {
				return objectName;
			}
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "identifyObject", "Object " + StringFunctions.convertObjectToString(aObject) + " doesn't exist.");
		return null;
	};
	
	/**
	 * Identifies the name of all the records that matches an object.
	 *
	 * @param	aObject			*		The object to identify.
	 * @param	aReturnArray	Array	The array to fill with the matching names.
	 */
	objectFunctions.identifyObjectWithMultipleResults = function(aObject, aReturnArray) {
		for(var objectName in this._objectsObject) {
			if(this._objectsObject[objectName] === aObject) {
				aReturnArray.push(objectName);
			}
		}
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("ownsObjects: " + this.ownsObjects);
		if(this._namesArray !== null && this._namesArray !== undefined) {
			aReturnArray.push("properties: [" + this._namesArray.join(", ") + "]");
		}
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "currentSelectedItem":
				return false;
			case "_objectsObject":
			case "_objectsArray":
				return this.ownsObjects;
		}
		return this.superCall(aName);
	};
	
	/**
	 * Performs the destruction of the object if they are owned by this array.
	 */
	objectFunctions._performDestroyObjects = function() {
		if(this.ownsObjects) {
			ClassReference.softDestroyArrayIfExists(this._objectsArray);
		}
		ClassReference._reuseObject(this._objectsObject);
		ClassReference._reuseArray(this._objectsArray);
		ClassReference._reuseArray(this._namesArray);
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		this._performDestroyObjects();
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectsObject = null;
		this._objectsArray = null;
		this._namesArray = null;
		
		this.currentSelectedItem = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aOwnsObjects	Boolean		True if this array owns the objects and should destroy them when the array is destroyed.
	 *
	 * @return	ClassDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aOwnsObjects) {
		var newNamedArray = ClassReference._createAndInitClass(ClassReference);
		newNamedArray.ownsObjects = VariableAliases.isTrue(aOwnsObjects);
		return newNamedArray;
	};
	
	/**
	 * Creates a native object from a named array.
	 *
	 * @param	aNamedArray		NamedArray	The array to get values from.
	 *
	 * @param	Object	An object with all the fields set to the same values as the named array.
	 */
	staticFunctions.getNativeObjectFromNamedArray = function(aNamedArray) {
		var returnObject = new Object();
		
		var currentArray = aNamedArray.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0 ; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			returnObject[currentName] = aNamedArray.getObject(currentName);
		}
		
		return returnObject;
	};
});