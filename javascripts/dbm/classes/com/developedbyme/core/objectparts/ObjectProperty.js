/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Property for a FlowBaseObject that enables to combine all input properties into a more complex object.
 */
dbm.registerClass("com.developedbyme.core.objectparts.ObjectProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ObjectProperty");
	//"use strict";
	
	//Self reference
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::_init");
		
		this.superCall();
		this._isOutput = true;
		this._objectProperties = new Array();
		
		return this;
	};
	
	/**
	 * Checks if this object is an output or an input. If the object is an input it's generated dynamically by the stream.
	 *
	 * @return	Boolean		True if the property is an output.
	 */
	objectFunctions.isOutput = function() {
		return this._isOutput;
	};
	
	/**
	 * Interface function. Doesn't do anything.
	 *
	 * @param	aValue	*	Ignored.
	 */
	objectFunctions.setValue = function(aValue) {
		
	};
	
	/**
	 * Sets up this property.
	 *
	 * @param	FlowBaseObject	The object that owns this property.
	 *
	 * @return	self
	 */
	objectFunctions.setup = function(aObject) {
		this._value = aObject;
		return this;
	};
	
	/**
	 * Interface function. Ignores the value but sets the status.
	 *
	 * @param	aValue				*		Ignored.
	 * @param	aFlowUpdateNumber	Number	The integer for keeping track of flow updates.
	 */
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::setValueWithFlow");
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	/**
	 * Link registation to add a property on the object.
	 *
	 * @param	aProperty	Property	The property to add.
	 */
	objectFunctions._linkRegistration_addObjectProperty = function(aProperty) {
		this._objectProperties.push(aProperty);
	};
	
	/**
	 * Link registation to remove a property from the object.
	 *
	 * @param	aProperty	Property	The property to remove.
	 */
	objectFunctions._linkRegistration_removeObjectProperty = function(aProperty) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::_linkRegistration_removeObjectProperty");
		var objectIndex = ArrayFunctions.indexOfInArray(this._objectProperties, aProperty);
		if(objectIndex !== -1) {
			this._objectProperties.splice(objectIndex, 1);
		}
		//console.log("//com.developedbyme.core.objectparts.ObjectProperty::_linkRegistration_removeObjectProperty");
	};
	
	/**
	 * Fills an array with all the clean (status: updated) output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		if(!this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.getStatus === undefined || currentObject.getStatus() === FlowStatusTypes.UPDATED) {
					aReturnArray.push(currentObject);
				}
			}
		}
		this.superCall(aReturnArray);
	};
	
	/**
	 * Fills an array with all the dirty (status: needs update) input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		if(this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.getStatus === undefined || currentObject.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
					aReturnArray.push(currentObject);
				}
			}
		}
		this.superCall(aReturnArray);
	};
	
	/**
	 * Fills an array with all the output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllOutputConnections = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::fillWithAllOutputConnections");
		//console.log(this._isOutput, this._objectProperties);
		
		if(!this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				aReturnArray.push(currentObject);
			}
		}
		else {
			this.superCall(aReturnArray);
		}
	};
	
	/**
	 * Fills an array with all the all input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllInputConnections = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::fillWithAllInputConnections");
		
		if(this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				aReturnArray.push(currentObject);
			}
		}
		else {
			this.superCall(aReturnArray);
		}
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::performDestroy");
		//console.log(this.toString());
		
		if(this._objectProperties !== null) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				currentObject._linkRegistration_removeObjectInputConnection();
			}
			currentArray.splice(0, currentArrayLength);
		}
		
		this.superCall();
		//console.log("//com.developedbyme.core.objectparts.ObjectProperty::performDestroy");
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectProperties = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aObject		FlowBaseObject	The owner for the new property.
	 *
	 * @return	ObjectProperty	The newly created object.
	 */
	staticFunctions.create = function(aObject) {
		var newObjectProperty = ClassReference._createAndInitClass(ClassReference);
		newObjectProperty.setup(aObject);
		return newObjectProperty;
	};
	
});