/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An array that uses a lazy implementation to parse data.
 */
dbm.registerClass("dbm.utils.data.lazy.LazyArray", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.lazy.LazyArray");
	//"use strict";
	
	//Self reference
	var LazyArray = dbm.importClass("dbm.utils.data.lazy.LazyArray");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.lazy.LazyArray::_init");
		
		this.superCall();
		
		this._data = null;
		this._length = -1;
		this._parserTreeStructureItem = null;
		this._parsedData = null;
		
		return this;
	};
	
	objectFunctions.getLength = function() {
		return this._length;
	};
	
	objectFunctions.getByIndex = function(aIndex) {
		if(this._parsedData[aIndex]) {
			return this._parsedData[aIndex];
		}
		else {
			var currentParser = this._parserTreeStructureItem.getChildByName(aIndex);
			if(currentParser === null) {
				var defaultParserName = this._parserTreeStructureItem.getInheritedAttribute("defaultParser");
				currentParser = this._parserTreeStructureItem.getChildByName(defaultParserName);
			}
		
			//METODO: check for links?
		
			var parseData = {"data": this._data, "selection": aIndex, "currentObject": this, "selectedTreeStrcutureItem": currentParser};
		
			var childObject = currentParser.data.reevaluate(parseData);
			this._parsedData[aIndex] = childObject;
			return childObject;
		}
	}
	
	/**
	 * Sets the data to parse for this object.
	 *
	 * @param	aData	*	The data to parse.
	 *
	 * @return	self
	 */
	objectFunctions.setData = function(aData) {
		//console.log("dbm.utils.data.lazy.LazyArray::setData");
		//console.log(aData);
		
		this._data = aData;
		this._length = this._data.length;
		this._parsedData = new Array(this._length);
		
		return this;
	};
	
	objectFunctions.setTreeStructureItem = function(aTreeStructureItem) {
		this._parserTreeStructureItem = aTreeStructureItem;
		
		return this;
	};
	
	objectFunctions.getLazy = function(aPath) {
		//console.log("dbm.utils.data.lazy.LazyArray::getLazy");
		
		if(VariableAliases.isNull(aPath) || aPath === "") {
			return this;
		}
		else {
			var splittedPath = aPath.split("/");
			var currentPath = parseInt(splittedPath.shift(), 10);
			
			var childObject = this.getByIndex(currentPath);
			
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
		//console.log("dbm.utils.data.lazy.LazyArray::getData");
		
		if(VariableAliases.isNull(aPath) || aPath === "") {
			//METODO: parse whole object
			return null;
		}
		else {
			var splittedPath = aPath.split("/");
			var currentPath = parseInt(splittedPath.shift(), 10);
			
			var childObject = this.getByIndex(currentPath);
			
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
		//console.log("dbm.utils.data.lazy.LazyArray::create");
		//console.log(aData, aParserTreeStructureItem);
		var newLazyArray = ClassReference._createAndInitClass(ClassReference);
		newLazyArray.setData(aData);
		newLazyArray.setTreeStructureItem(aParserTreeStructureItem);
		return newLazyArray;
	};
});