/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty", "com.developedbyme.core.objectparts.ExternalCssVariableProperty", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty");
	//"use strict";
	
	//Self reference
	var ExternalPrefixedCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CssFunctions = dbm.importClass("com.developedbyme.utils.css.CssFunctions");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty::_performSetValue");
		//console.log(aValue);
		
		//METODO
		
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		
		CssFunctions.setBrowserSpecificCssToElement(this._externalObject, this._externalVariableName, aValue, this._unit, this._priority);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aExternalObject, aVariableName, aUnit) {
		var newExternalPrefixedCssVariableProperty = (new ExternalPrefixedCssVariableProperty()).init();
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newExternalPrefixedCssVariableProperty);
			newExternalPrefixedCssVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		newExternalPrefixedCssVariableProperty.setupExternalObject(aExternalObject, aVariableName, aUnit);
		return newExternalPrefixedCssVariableProperty;
	};
	
	staticFunctions.createWithoutExternalObject = function(aObjectInput, aValue) {
		var newExternalPrefixedCssVariableProperty = (new ExternalPrefixedCssVariableProperty()).init();
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newExternalPrefixedCssVariableProperty);
			newExternalPrefixedCssVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		if(aValue !== null && aValue !== undefined) {
			newExternalPrefixedCssVariableProperty.setValue(aValue);
		}
		return newExternalPrefixedCssVariableProperty;
	};
	
});