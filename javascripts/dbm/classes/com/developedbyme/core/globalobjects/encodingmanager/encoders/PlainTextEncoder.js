/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.encodingmanager.encoders.PlainTextEncoder", "com.developedbyme.core.globalobjects.encodingmanager.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.encodingmanager.encoders.PlainTextEncoder");
	
	//Self reference
	var PlainTextEncoder = dbm.importClass("com.developedbyme.core.globalobjects.encodingmanager.encoders.PlainTextEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.encodingmanager.encoders.PlainTextEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encode = function() {
		this._encodedValue = this._key;
		return this._encodedValue;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newPlainTextEncoder = (new PlainTextEncoder()).init();
		return newPlainTextEncoder;
	};
});