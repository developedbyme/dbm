/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that stores it value on an external object.
 */
dbm.registerClass("com.developedbyme.core.objectparts.ExternalVariableProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty");
	//"use strict";
	
	//Self reference
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constants
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::_init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		return this;
	};
	
	/**
	 * Gets the external object where the value is stored.
	 *
	 * @return	*	The object where the variable is stored.
	 */
	objectFunctions.getExternalObject = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::getExternalObject");
		
		return this._externalObject;
	};
	
	/**
	 * Sets the value of this property. Value is stored internally if the external object is not set yet.
	 *
	 * @param	aValue	*	The value of this property.
	 */
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::_performSetValue");
		//console.log(aValue);
		
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		this._externalObject[this._externalVariableName] = aValue;
	};
	
	/**
	 * Gets the value of this property. Internal value is used if the external object is not set yet.
	 *
	 * @return	*	The value of the property.
	 */
	objectFunctions.getValueWithoutFlow = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::getValueWithoutFlow");
		if(this._externalObject === null) {
			return this._value;
		}
		return this._externalObject[this._externalVariableName];
	};
	
	/**
	 * Sets up the storage on the external object.
	 *
	 * @param	aObject			*		The object where the variable is stored.
	 * @param	aVariableName	String	The name of the variable to store the value in.
	 */
	objectFunctions.setupExternalObject = function(aObject, aVariableName) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::setupExternalObject");
		//console.log(aObject, aVariableName);
		
		if(this._externalObject !== null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MINOR, this, "setupExternalObject", "Property already has external object. Replacing.");
			this.removeExternalObject();
		}
		
		var startValue = this.getValue();
		
		this._externalObject = aObject;
		this._externalVariableName = aVariableName;
		
		if(VariableAliases.isSet(startValue)) {
			this._performSetValue(startValue);
		}
		else {
			this.setAsDirty();
		}
	};
	
	/**
	 * Internal functionality to set the name of the external variable.
	 *
	 * @param	aVariableName	String	The name of the variable to store the value in.
	 */
	objectFunctions._internalFunctionality_setExternalVariableName = function(aVariableName) {
		this._externalVariableName = aVariableName;
	};
	
	/**
	 * Removes the external object from this property.
	 */
	objectFunctions.removeExternalObject = function() {
		
		if(this._externalObject !== null) {
			this._value = this._externalObject[this._externalVariableName];
		}
		else {
			//METODO: error message
		}
		
		this._externalObject = null;
		this._externalVariableName = null;
		
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aExternalObject		*				The object where the variable is stored.
	 * @param	aVariableName		String			The name of the variable to store the value in.
	 *
	 * @return	ExternalVariableProperty	The newly created object.
	 */
	staticFunctions.create = function(aExternalObject, aVariableName) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::create");
		var newExternalVariableProperty = (new ExternalVariableProperty()).init();
		newExternalVariableProperty.setupExternalObject(aExternalObject, aVariableName);
		return newExternalVariableProperty;
	};
	
	/**
	 * Creates a new object of this class, without setting the external object.
	 *
	 * @param	aValue	*	The value for the new property. (Optional)
	 *
	 * @return	ExternalVariableProperty	The newly created object.
	 */
	staticFunctions.createWithoutExternalObject = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::createWithoutExternalObject");
		var newExternalVariableProperty = ClassReference._createWithInputValue(ClassReference, aValue);
		return newExternalVariableProperty;
	};
	
});