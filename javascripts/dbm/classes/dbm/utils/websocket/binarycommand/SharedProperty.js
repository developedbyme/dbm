/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.SharedProperty", "dbm.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.SharedProperty");
	//"use strict";
	
	//Self reference
	var SharedProperty = dbm.importClass("dbm.utils.websocket.binarycommand.SharedProperty");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("dbm.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.SharedProperty::_init");
		
		this.superCall();
		
		this._connection = null;
		this._encoder = null;
		this._dataArray = new Array(2);
		
		return this;
	};
	
	objectFunctions.setupConnection = function(aConnection, aEncoder, aIndex) {
		this._connection = aConnection;
		this._encoder = aEncoder;
		this._dataArray[0] = aIndex;
		//METODO: should we send initial value
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("dbm.utils.websocket.binarycommand.SharedProperty::_performSetValue");
		//console.log(this);
		if(aValue !== this._value) {
			this._dataArray[1] = aValue;
			if(this._connection !== null) {
				this._connection.performEncodeAndSend(this._encoder, this._dataArray);
			}
		}
		this.superCall(aValue);
	};
	
	objectFunctions.setValueFromConnection = function(aValue) {
		this._value = aValue;
		this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_connection":
			case "_encoder":
				return false;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._connection = null;
		this._encoder = null;
		this._dataArray = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aValue, aConnection, aEncoder, aIndex) {
		//console.log("dbm.utils.websocket.binarycommand.SharedProperty::_performSetValue");
		//console.log(aObjectInput, aValue, aConnection, aEncoder, aIndex);
		return ClassReference._createWithInputValue(SharedProperty, aObjectInput, aValue).setupConnection(aConnection, aEncoder, aIndex);
	};
	
});