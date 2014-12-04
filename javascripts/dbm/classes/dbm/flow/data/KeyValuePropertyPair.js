/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.data.KeyValuePropertyPair", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.data.KeyValuePropertyPair");
	
	var KeyValuePropertyPair = dbm.importClass("dbm.flow.data.KeyValuePropertyPair");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.data.KeyValuePropertyPair::_init");
		
		this.superCall();
		
		this.keyValue = this.createProperty("keyValue", "");
		this.dataValue = this.createProperty("dataValue", "");
		
		return this;
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.keyValue = null;
		this.dataValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aKeyValue, aDataValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("keyValue", aKeyValue);
		newNode.setPropertyInputWithoutNull("dataValue", aDataValue);
		return newNode;
	};
});