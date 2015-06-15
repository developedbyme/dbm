/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.binarycommand.SharedPropertiesConnection", "dbm.utils.websocket.binarycommand.BinaryCommandConnection", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.binarycommand.SharedPropertiesConnection");
	
	//Self reference
	var SharedPropertiesConnection = dbm.importClass("dbm.utils.websocket.binarycommand.SharedPropertiesConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var SharedProperty = dbm.importClass("dbm.utils.websocket.binarycommand.SharedProperty");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("dbm.constants.websocket.BinaryCommandPaths");
	var SharedPropertyDataTypes = dbm.importClass("dbm.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.websocket.binarycommand.SharedPropertiesConnection::_init");
		
		this.superCall();
		
		this._sharedProperties = new Array();
		this._isUpdating = false; //Replace this with an anychange property
		
		return this;
	};
	
	objectFunctions.createSharedProperty = function(aName, aIndex, aValue, aDataType) {
		//console.log("dbm.utils.websocket.binarycommand.SharedPropertiesConnection::createSharedProperty");
		
		aDataType = VariableAliases.valueWithDefault(aDataType, SharedPropertyDataTypes.ANY);
		
		var encoder = this._namedEncoders.getObject(BinaryCommandPaths.FLOW_UPDATE_PROPERTY);
		encoder.setDataTypeForIndex(aIndex, aDataType);
		var newProperty = SharedProperty.create(aValue, this, encoder, aIndex);
		this.addProperty(aName, newProperty);
		this._sharedProperties.push(newProperty);
		
		if(this._isUpdating) {
			newProperty.startUpdating();
		}
		
		return newProperty;
	};
	
	objectFunctions.updatePropertyFromConnection = function(aIndex, aValue) {
		//console.log("dbm.utils.websocket.binarycommand.SharedPropertiesConnection::updatePropertyFromConnection");
		//console.log(aIndex, aValue);
		var currentProperty = this._sharedProperties[aIndex];
		if(VariableAliases.isSet(currentProperty)) {
			currentProperty.setValueFromConnection(aValue);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "updatePropertyFromConnection", "No property uses index " + aIndex + ".");
		}
	};
	
	objectFunctions.startUpdatingTransfer = function() {
		
		this._isUpdating = true;
		
		var currentArray = this._sharedProperties;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.startUpdating();
		}
		
		return this;
	};
	
	objectFunctions.stopUpdatingTransfer = function() {
		
		this._isUpdating = false;
		
		var currentArray = this._sharedProperties;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.stopUpdating();
		}
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._sharedProperties = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aConnection) {
		return ClassReference._createAndInitClass(ClassReference).setConnection(aConnection);
	};
});