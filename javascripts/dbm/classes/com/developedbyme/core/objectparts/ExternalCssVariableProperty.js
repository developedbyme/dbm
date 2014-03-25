/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	//"use strict";
	
	//Self reference
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
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
		//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty::_init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		this._priority = "";
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty::_performSetValue");
		//console.log(aValue);
		
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		
		CssFunctions.setStyleProperty(this._externalObject, this._externalVariableName, aValue, this._unit, this._priority);
	};
	
	objectFunctions._performGetValue = function() {
		
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
	
	objectFunctions.setup = function(aVariableName, aUnit, aDefaultValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty::setup");
		//console.log(aVariableName, aUnit, aDefaultValue);
		
		this._externalVariableName = aVariableName;
		this._unit = aUnit;
		
		var startValue = this.getValue();
		if(startValue !== null) {
			this._performSetValue(startValue);
		}
		else {
			if(this.getValue() === null && aDefaultValue !== null) {
				this._performSetValue(aDefaultValue);
			}
		}
		
		this.setAsDirty();
		
		return this;
	};
	
	objectFunctions.setExternalObject = function(aObject) {
		//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty::setExternalObject");
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
		
		this.setAsDirty();
		
		return this;
	};
	
	objectFunctions.setupExternalObject = function(aObject, aVariableName, aUnit, aDefaultValue) {
		
		this.setup(aVariableName, aUnit, aDefaultValue);
		this.setExternalObject(aObject);
		
		return this;
	};
	
	objectFunctions.removeExternalObject = function() {
		
		if(this._externalObject !== null) {
			this._value = this._performGetValue();
		}
		else {
			//METODO: error message
		}
		
		this._externalObject = null;
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aExternalObject, aVariableName, aUnit) {
		var newExternalCssVariableProperty = (new ExternalCssVariableProperty()).init();
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newExternalCssVariableProperty);
			newExternalCssVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		newExternalCssVariableProperty.setupExternalObject(aExternalObject, aVariableName, aUnit);
		return newExternalCssVariableProperty;
	};
	
	staticFunctions.createWithoutExternalObject = function(aObjectInput, aValue) {
		var newExternalCssVariableProperty = (new ExternalCssVariableProperty()).init();
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newExternalCssVariableProperty);
			newExternalCssVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		if(aValue !== null && aValue !== undefined) {
			newExternalCssVariableProperty.setValue(aValue);
		}
		return newExternalCssVariableProperty;
	};
	
});