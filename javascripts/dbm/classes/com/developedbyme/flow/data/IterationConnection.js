/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.data.IterationConnection", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.data.IterationConnection");
	
	var IterationConnection = dbm.importClass("com.developedbyme.flow.data.IterationConnection");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.data.IterationConnection::_init");
		
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