/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Property that updates a style property of an element, and it's set with all browser prefixes.
 */
dbm.registerClass("dbm.core.objectparts.ExternalPrefixedCssVariableProperty", "dbm.core.objectparts.ExternalCssVariableProperty", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.ExternalPrefixedCssVariableProperty");
	//"use strict";
	
	//Self reference
	var ExternalPrefixedCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalPrefixedCssVariableProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CssFunctions = dbm.importClass("dbm.utils.css.CssFunctions");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("dbm.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.ExternalPrefixedCssVariableProperty::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Sets the value of this property (which updates the style of the external object). Value is stored internally if the external object is not set yet.
	 *
	 * @param	aValue	*	The value of this property.
	 */
	objectFunctions._performSetValue = function(aValue) {
		//console.log("dbm.core.objectparts.ExternalPrefixedCssVariableProperty::_performSetValue");
		//console.log(aValue);
		
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		
		CssFunctions.setBrowserSpecificCssToElement(this._externalObject, this._externalVariableName, aValue, this._unit, this._priority);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aExternalObject		*				The object where the variable is stored.
	 * @param	aVariableName		String			The name of the variable to store the value in.
	 * @param	aUnit				String			The css unit for the value
	 *
	 * @return	ExternalPrefixedCssVariableProperty		The newly created object.
	 */
	staticFunctions.create = function(aExternalObject, aVariableName, aUnit) {
		var newExternalPrefixedCssVariableProperty = (new ExternalPrefixedCssVariableProperty()).init();
		newExternalPrefixedCssVariableProperty.setupExternalObject(aExternalObject, aVariableName, aUnit);
		return newExternalPrefixedCssVariableProperty;
	};
	
	/**
	 * Creates a new object of this class, without setting the external object.
	 *
	 * @param	aValue	*	The value for the new property. (Optional)
	 *
	 * @return	ExternalPrefixedCssVariableProperty		The newly created object.
	 */
	staticFunctions.createWithoutExternalObject = function(aValue) {
		var newExternalPrefixedCssVariableProperty = ClassReference._createWithInputValue(ClassReference, aValue);
		return newExternalPrefixedCssVariableProperty;
	};
	
});