/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject");
	
	//Self reference
	var EncodingDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject");
	
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
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject::_init");
		
		this.superCall();
		
		this.name = null;
		this.type = null;
		this.dataType = null;
		this.parentApplyType = null;
		this.attributes = new Array();
		this.nodeValue = null;
		this.parentNode = null;
		
		return this;
	};
	
	staticFunctions.create = function() {
		var newEncodingDataObject = ClassReference._createAndInitClass(ClassReference);
		
		return newEncodingDataObject;
	};
	
	staticFunctions.createSimpleValue = function(aDataType, aValue, aParentNode) {
		var newEncodingDataObject = ClassReference._createAndInitClass(ClassReference);
		
		newEncodingDataObject.type = "simpleValue";
		newEncodingDataObject.dataType = aDataType;
		newEncodingDataObject.nodeValue = aValue;
		newEncodingDataObject.parentNode = aParentNode;
		aParentNode.nodeValue.push(newEncodingDataObject);
		
		return newEncodingDataObject;
	};
	
	staticFunctions.createAttribute = function(aName, aValue, aParentNode) {
		var newEncodingDataObject = ClassReference._createAndInitClass(ClassReference);
		
		newEncodingDataObject.type = "attribute";
		newEncodingDataObject.dataType = "string";
		newEncodingDataObject.name = aName;
		newEncodingDataObject.nodeValue = aValue;
		newEncodingDataObject.parentNode = aParentNode;
		aParentNode.attributes.push(newEncodingDataObject);
		
		return newEncodingDataObject;
	};
	
	staticFunctions.createComplexValue = function(aDataType, aParentNode) {
		var newEncodingDataObject = ClassReference._createAndInitClass(ClassReference);
		
		newEncodingDataObject.type = "complexValue";
		newEncodingDataObject.dataType = aDataType;
		newEncodingDataObject.nodeValue = new Array();
		newEncodingDataObject.parentNode = aParentNode;
		aParentNode.nodeValue.push(newEncodingDataObject);
		
		return newEncodingDataObject;
	};
});