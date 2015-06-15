/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.data.IterationConnection", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.data.IterationConnection");
	
	var IterationConnection = dbm.importClass("dbm.flow.data.IterationConnection");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.data.IterationConnection::_init");
		
		this.superCall();
		
		this.inputProperty = null;
		this.outputProperty = null;
		
		return this;
	};
	
	/**
	 * Performs the destruction of this class.
	 */
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	/**
	 * Creates a new connection.
	 */
	staticFunctions.create = function(aInputProperty, aOutputProperty) {
		var newConnection = (new IterationConnection()).init();
		newConnection.inputProperty = aInputProperty;
		newConnection.outputProperty = aOutputProperty;
		return newConnection;
	};
});