dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection", "com.developedbyme.utils.websocket.binarycommand.BinaryCommandConnection", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection");
	
	//Self reference
	var SharedPropertiesConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var SharedProperty = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedProperty");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var BinaryCommandPaths = dbm.importClass("com.developedbyme.constants.websocket.BinaryCommandPaths");
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection::_init");
		
		this.superCall();
		
		this._sharedProperties = new Array();
		this._isUpdating = false; //Replace this with an anychange property
		
		return this;
	};
	
	objectFunctions.createSharedProperty = function(aName, aIndex, aValue, aDataType) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection::createSharedProperty");
		
		aDataType = VariableAliases.valueWithDefault(aDataType, SharedPropertyDataTypes.ANY);
		
		var encoder = this._namedEncoders.getObject(BinaryCommandPaths.FLOW_UPDATE_PROPERTY);
		encoder.setDataTypeForIndex(aIndex, aDataType);
		var newProperty = SharedProperty.create(this._objectProperty, aValue, this, encoder, aIndex);
		this.addProperty(aName, newProperty);
		this._sharedProperties.push(newProperty);
		
		if(this._isUpdating) {
			newProperty.startUpdating();
		}
		
		return newProperty;
	};
	
	objectFunctions.updatePropertyFromConnection = function(aIndex, aValue) {
		//console.log("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection::updatePropertyFromConnection");
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