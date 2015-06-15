/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Property that updates a style property of an element.
 */
dbm.registerClass("dbm.core.objectparts.ExternalCssVariableProperty", "dbm.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.ExternalCssVariableProperty");
	//"use strict";
	
	//Self reference
	var ExternalCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalCssVariableProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CssFunctions = dbm.importClass("dbm.utils.css.CssFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.ExternalCssVariableProperty::_init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		this._priority = "";
		
		return this;
	};
	
	/**
	 * Sets the value of this property (which updates the style of the external object). Value is stored internally if the external object is not set yet.
	 *
	 * @param	aValue	*	The value of this property.
	 */
	objectFunctions._performSetValue = function(aValue) {
		//console.log("dbm.core.objectparts.ExternalCssVariableProperty::_performSetValue");
		//console.log(aValue);
		
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		
		CssFunctions.setStyleProperty(this._externalObject, this._externalVariableName, aValue, this._unit, this._priority);
	};
	
	/**
	 * Gets the value of this property. Internal value is used if the external object is not set yet.
	 *
	 * @return	*	The value of the property.
	 */
	objectFunctions.getValueWithoutFlow = function() {
		
		if(this._externalObject === null) {
			return this._value;
		}
		
		var cssValue;
		cssValue = this._externalObject.style.getPropertyValue(this._externalVariableName);
		
		if(cssValue === null) {
			return null;
		}
		else if(this._unit !== null) {
			var unitPosition = cssValue.lastIndexOf(this._unit);
			var valueWithoutUnit = cssValue.substring(0, unitPosition);
			return parseFloat(valueWithoutUnit);
		}
		
		return cssValue;
	};
	
	/**
	 * Sets up the storage, without knowing the external object.
	 *
	 * @param	aVariableName	String	The name of the variable to store the value in.
	 * @param	aUnit			String	The css unit for the value.
	 * @param	aDefaultValue	*		The default value to set the property to if it doesn't already have a value. (Optional)
	 *
	 * @return	self
	 */
	objectFunctions.setup = function(aVariableName, aUnit, aDefaultValue) {
		//console.log("dbm.core.objectparts.ExternalCssVariableProperty::setup");
		//console.log(aVariableName, aUnit, aDefaultValue);
		
		this._externalVariableName = aVariableName;
		this._unit = aUnit;
		
		var startValue = this.getValue();
		if(VariableAliases.isSet(startValue)) {
			this._performSetValue(startValue);
		}
		else {
			if(this.getValue() === null && VariableAliases.isSet(aDefaultValue)) {
				this._performSetValue(aDefaultValue);
			}
		}
		
		this.setAsDirty();
		
		return this;
	};
	
	/**
	 * Sets the external object for this property.
	 *
	 * @param	aObject		HTMLElement		The element to set the style property on.
	 *
	 * @return	self
	 */
	objectFunctions.setExternalObject = function(aObject) {
		//console.log("dbm.core.objectparts.ExternalCssVariableProperty::setExternalObject");
		//console.log(aObject);
		
		if(this._externalObject !== null) {
			//METODO: warning message
			this.removeExternalObject();
		}
		
		var startValue = this.getValue();
		
		this._externalObject = aObject;
		
		if(startValue !== null) {
			this._performSetValue(startValue);
		}
		else {
			this.setAsDirty();
		}
		
		return this;
	};
	
	/**
	 * Sets up the storage on the external object.
	 *
	 * @param	aObject			*		The object where the variable is stored.
	 * @param	aVariableName	String	The name of the variable to store the value in.
	 * @param	aUnit			String	The css unit for the value.
	 * @param	aDefaultValue	*		The default value to set the property to if it doesn't already have a value. (Optional)
	 */
	objectFunctions.setupExternalObject = function(aObject, aVariableName, aUnit, aDefaultValue) {
		
		this.setup(aVariableName, aUnit, aDefaultValue);
		this.setExternalObject(aObject);
		
		return this;
	};
	
	/**
	 * Removes the external object from this property.
	 */
	objectFunctions.removeExternalObject = function() {
		
		if(this._externalObject !== null) {
			this._value = this.getValueWithoutFlow();
		}
		else {
			//METODO: error message
		}
		
		this._externalObject = null;
		
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aExternalObject		*				The object where the variable is stored.
	 * @param	aVariableName		String			The name of the variable to store the value in.
	 * @param	aUnit				String			The css unit for the value.
	 *
	 * @return	ExternalCssVariableProperty		The newly created object.
	 */
	staticFunctions.create = function(aExternalObject, aVariableName, aUnit) {
		var newExternalCssVariableProperty = (new ExternalCssVariableProperty()).init();
		newExternalCssVariableProperty.setupExternalObject(aExternalObject, aVariableName, aUnit);
		return newExternalCssVariableProperty;
	};
	
	/**
	 * Creates a new object of this class, without setting the external object.
	 *
	 * @param	aValue	*	The value for the new property. (Optional)
	 *
	 * @return	ExternalCssVariableProperty		The newly created object.
	 */
	staticFunctions.createWithoutExternalObject = function(aValue) {
		var newExternalCssVariableProperty = ClassReference._createWithInputValue(ClassReference, aValue);
		return newExternalCssVariableProperty;
	};
	
});