/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.core.globalobjects.encodingmanager.encoders.SignatureEncoder", "dbm.core.globalobjects.encodingmanager.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.core.globalobjects.encodingmanager.encoders.SignatureEncoder");
	
	var crypto = require("crypto");
	
	//Self reference
	var SignatureEncoder = dbm.importClass("dbm.nodejs.core.globalobjects.encodingmanager.encoders.SignatureEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.DEFAULT_OUTPUT_FORMAT = "base64";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.core.globalobjects.encodingmanager.encoders.SignatureEncoder::_init");
		
		this.superCall();
		
		this._algorithmMethod = null;
		this._outputFormat = ClassReference.DEFAULT_OUTPUT_FORMAT;
		
		return this;
	};
	
	objectFunctions.setAlgorithmMethod = function(aMethod) {
		this._algorithmMethod = aMethod;
		return this;
	};
	
	objectFunctions.setOutputFormat = function(aOutputFormat) {
		this._outputFormat = aOutputFormat;
		return this;
	};
	
	objectFunctions.encode = function() {
		this._encodedValue = crypto.createSign(this._algorithmMethod).update(this._value).sign(this._key, this._outputFormat);
		return this._encodedValue;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._algorithmMethod = null;
		this._outputFormat = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAlgorithmMethod, aOutputFormat) {
		aOutputFormat = VariableAliases.valueWithDefault(aOutputFormat, ClassReference.DEFAULT_OUTPUT_FORMAT);
		var newSignatureEncoder = (new SignatureEncoder()).init();
		newSignatureEncoder.setAlgorithmMethod(aAlgorithmMethod).setOutputFormat(aOutputFormat);
		return newSignatureEncoder;
	};
});