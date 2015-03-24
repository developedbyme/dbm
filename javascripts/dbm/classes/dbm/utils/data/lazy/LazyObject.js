/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An object that uses a lazy implementation to parse data.
 */
dbm.registerClass("dbm.utils.data.lazy.LazyObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.lazy.LazyObject");
	//"use strict";
	
	//Self reference
	var LazyObject = dbm.importClass("dbm.utils.data.lazy.LazyObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.lazy.LazyObject::_init");
		
		this.superCall();
		
		this._data = null;
		this._parserTreeStructureItem = null;
		this._parsedData = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	/**
	 * Sets the data to parse for this object.
	 *
	 * @param	aData	*	The data to parse.
	 *
	 * @return	self
	 */
	objectFunctions.setData = function(aData) {
		this._data = aData;
		
		return this;
	};
	
	objectFunctions.setParsedData = function(aName, aLazyObject) {
		this._parsedData.addObject(aName, aLazyObject);
	};
	
	objectFunctions.setTreeStructureItem = function(aTreeStructureItem) {
		this._parserTreeStructureItem = aTreeStructureItem;
		
		return this;
	};
	
	objectFunctions.getLazy = function(aPath) {
		if(VariableAliases.isNull(aPath) || aPath === "") {
			return this;
		}
		else {
			var splittedPath = aPath.split("/");
			var currentPath = splittedPath.shift();
			
			var childObject = null;
			if(this._parsedData.select(currentPath)) {
				childObject = this._parsedData.currentSelectedItem;
			}
			else {
				var currentParser = this._parserTreeStructureItem.getChildByName(currentPath);
				if(currentParser === null) {
					var defaultParserName = this._parserTreeStructureItem.getInheritedAttribute("defaultParser");
					currentParser = this._parserTreeStructureItem.getChildByName(defaultParserName);
				}
			
				//METODO: check for links?
			
				var parseData = {"data": this._data, "selection": currentPath, "currentObject": this, "selectedTreeStrcutureItem": currentParser};
			
				childObject = currentParser.data.reevaluate(parseData);
				this._parsedData.addObject(currentPath, childObject);
			}
			
			return childObject.getLazy(splittedPath.join("/"));
		}
	};
	
	/**
	 * Gets data from this object. The data is parsed if it's not already.
	 *
	 * @param	aPath	String	The path to get from this object.
	 *
	 * @return	*	The parsed data.
	 */
	objectFunctions.getData = function(aPath) {
		//console.log("getData");
		//console.log(aPath);
		
		if(VariableAliases.isNull(aPath) || aPath === "") {
			//METODO: parse whole object
			return null;
		}
		else {
			var splittedPath = aPath.split("/");
			var currentPath = splittedPath.shift();
			
			var childObject = null;
			if(this._parsedData.select(currentPath)) {
				childObject = this._parsedData.currentSelectedItem;
			}
			else {
				var currentParser = this._parserTreeStructureItem.getChildByName(currentPath);
				if(currentParser === null) {
					var defaultParserName = this._parserTreeStructureItem.getInheritedAttribute("defaultParser");
					currentParser = this._parserTreeStructureItem.getChildByName(defaultParserName);
				}
			
				//METODO: check for links?
			
				var parseData = {"data": this._data, "selection": currentPath, "currentObject": this, "selectedTreeStrcutureItem": currentParser};
			
				childObject = currentParser.data.reevaluate(parseData);
				this._parsedData.addObject(currentPath, childObject);
			}
			
			return childObject.getData(splittedPath.join("/"));
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
			case "_data":
				return false;
		}
		return this.superCall(aName);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._data = null;
		this._parsedData = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData						*					The data to be parsed.
	 * @param	aParserTreeStructureItem	TreeStructureItem	The parser data.
	 *
	 * @return	ClassDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aData, aParserTreeStructureItem) {
		var newLazyObject = ClassReference._createAndInitClass(ClassReference);
		newLazyObject.setData(aData);
		newLazyObject.setTreeStructureItem(aParserTreeStructureItem);
		return newLazyObject;
	};
});