/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.data.IterationObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.data.IterationObject");
	
	var IterationObject = dbm.importClass("dbm.flow.data.IterationObject");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var IterationConnection = dbm.importClass("dbm.flow.data.IterationConnection");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.data.IterationObject::_init");
		
		this.superCall();
		
		this._inputs = (new NamedArray()).init();
		this._outputs = (new NamedArray()).init();
		
		return this;
	};
	
	objectFunctions.addInput = function(aName, aInProperty, aOutProperty) {
		var newConnection = IterationConnection.create(aInProperty, aOutProperty);
		this._inputs.addObject(aName, newConnection);
		return newConnection;
	};
	
	objectFunctions.addOutput = function(aName, aInProperty, aOutProperty) {
		var newConnection = IterationConnection.create(aInProperty, aOutProperty);
		this._outputs.addObject(aName, newConnection);
		return newConnection;
	};
	
	objectFunctions.updateInputs = function() {
		//console.log("dbm.flow.data.IterationObject::updateInputs");
		var currentArray = this._inputs.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			//console.log(currentConnection.inputProperty, currentConnection.outputProperty);
			currentConnection.outputProperty.setValue(currentConnection.inputProperty.getValue());
		}
	};
	
	objectFunctions.updateOutputs = function() {
		//console.log("dbm.flow.data.IterationObject::updateOutputs");
		var currentArray = this._outputs.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			currentConnection.outputProperty.setValue(currentConnection.inputProperty.getValue());
		}
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
});