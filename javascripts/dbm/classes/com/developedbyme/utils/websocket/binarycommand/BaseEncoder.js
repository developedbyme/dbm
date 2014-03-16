/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.BaseEncoder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.BaseEncoder");
	
	//Self reference
	var BaseEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.BaseEncoder");
	
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
		//console.log("com.developedbyme.utils.websocket.binarycommand.BaseEncoder::_init");
		
		this.superCall();
		
		this._messagePrefix = null;
		this._dataEncoders = new Array();
		this.decodedEventPerformer = null;
		
		return this;
	};
	
	objectFunctions.setMessagePrefix = function(aMessagePrefix) {
		this._messagePrefix = aMessagePrefix;
		
		return this;
	};
	
	objectFunctions.addDataEncoder = function(aEncoder) {
		this._dataEncoders.push(aEncoder);
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.BaseEncoder::encode");
		//console.log(this._messagePrefix);
		
		aEncodingData.addStringToMessage(this._messagePrefix);
		
		var currentArray = this._dataEncoders;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentEncoder = currentArray[i];
			currentEncoder.encode(aEncodingData);
		}
	};
	
	objectFunctions.decode = function(aDecodingData) {
		var currentArray = this._dataEncoders;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentEncoder = currentArray[i];
			currentEncoder.decode(aDecodingData);
		}
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "decodedEventPerformer":
				return false;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._messagePrefix = null;
		this._dataEncoders = null;
		this.decodedEventPerformer = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
	
	staticFunctions.createWithMessagePrefix = function(aMessagePrefix) {
		return ClassReference._createAndInitClass(ClassReference).setMessagePrefix(aMessagePrefix);
	};
});