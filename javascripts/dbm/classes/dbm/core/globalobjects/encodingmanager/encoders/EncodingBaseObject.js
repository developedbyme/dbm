/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.encodingmanager.encoders.EncodingBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.encodingmanager.encoders.EncodingBaseObject");
	
	//Self reference
	var EncodingBaseObject = dbm.importClass("dbm.core.globalobjects.encodingmanager.encoders.EncodingBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.encodingmanager.encoders.EncodingBaseObject::_init");
		
		this.superCall();
		
		this._key = null;
		this._value = null;
		this._encodedValue = null;
		
		return this;
	};
	
	objectFunctions.setKey = function(aKey) {
		this._key = aKey;
		
		return this;
	};
	
	objectFunctions.setValue = function(aValue) {
		this._value = aValue;
		
		return this;
	};
	
	objectFunctions.getEncodedValue = function() {
		return this._encodedValue;
	};
	
	objectFunctions.encode = function() {
		//MENOTE: should be overridden
		//METODO: error message
		return null;
	};
	
	objectFunctions.reset = function() {
		this._key = null;
		this._value = null;
		this._encodedValue = null;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._key = null;
		this._value = null;
		this._encodedValue = null;
		
		this.superCall();
	};
});