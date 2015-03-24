/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A value of an object that uses a lazy implementation to parse data.
 */
dbm.registerClass("dbm.utils.data.lazy.LazyData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.lazy.LazyData");
	//"use strict";
	
	//Self reference
	var LazyData = dbm.importClass("dbm.utils.data.lazy.LazyData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	staticFunctions.NULL_OBJECT = new Object();
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.lazy.LazyData::_init");
		
		this.superCall();
		
		this._data = null;
		this._parserTreeStructureItem = null;
		this._parsedData = ClassReference.NULL_OBJECT;
		
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
	
	objectFunctions.setParsedData = function(aData) {
		this._parsedData = aData;
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
			//METODO: error message
			return null;
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
		
		if(VariableAliases.isNull(aPath) || aPath === "") {
			
			if(this._parsedData === ClassReference.NULL_OBJECT) {
				var parser = this._parserTreeStructureItem.getChildByName(this._parserTreeStructureItem.getInheritedAttribute("objectParser"));
		
				//METODO: check for links?
		
				var parseData = {"data": this._data, "selection": null, "currentObject": this, "selectedTreeStrcutureItem": parser};
				this._parsedData = parser.data.reevaluate(parseData);
			}
			
			return this._parsedData;
		}
		else {
			//METODO: error message
			return null;
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
		var newLazyData = ClassReference._createAndInitClass(ClassReference);
		newLazyData.setData(aData);
		newLazyData.setTreeStrcutureItem(aParserTreeStructureItem);
		return newLazyData;
	};
});