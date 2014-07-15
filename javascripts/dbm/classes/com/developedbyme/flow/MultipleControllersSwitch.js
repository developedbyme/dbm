/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.MultipleControllersSwitch", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.MultipleControllersSwitch");
	//"use strict";
	
	//Self reference
	var MultipleControllersSwitch = dbm.importClass("com.developedbyme.flow.MultipleControllersSwitch");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.MultipleControllersSwitch::_init");
		
		this.superCall();
		
		this._inputConnection = null;
		this._outputConnection = null;
		
		this._currentController = this.createProperty("currentController", -1);
		this._updateProperty = this.createGhostProperty("update");
		this.createUpdateFunction("default", this._updateFlow, [this._currentController], [this._updateProperty]);
		this._lastController = -1;
		this._inputControllers = new Array();
		this._outputControllers = new Array();
		
		this._defaultController = -1;
		
		return this;
	};
	
	objectFunctions.startUpdating = function() {
		this._updateProperty.startUpdating();
	};
	
	objectFunctions.stopUpdating = function() {
		this._updateProperty.stopUpdating();
	};
	
	objectFunctions.setInputConnection = function(aConnection) {
		this._inputConnection = aConnection;
		
		return this;
	};
	
	objectFunctions.setOutputConnection = function(aConnection) {
		this._outputConnection = aConnection;
		
		return this;
	};
	
	objectFunctions.setDefaultController = function(aControllerProperty) {
		this._defaultController = ArrayFunctions.indexOfInArray(this._inputControllers, aControllerProperty);
		if(this._currentController.getValue() === -1) {
			this._currentController.setValue(this._defaultController);
			this._updateProperty.update();
		}
		
		return this;
	};
	
	objectFunctions.addController = function(aControllerProperty, aOutputControllerProperty) {
		
		aOutputControllerProperty = VariableAliases.valueWithDefault(aOutputControllerProperty, aControllerProperty);
		
		aControllerProperty.connectInput(this._inputConnection);
		
		this._inputControllers.push(aControllerProperty);
		this._outputControllers.push(aOutputControllerProperty);
		
		return this;
	};
	
	objectFunctions.selectController = function(aControllerProperty) {
		this._updateProperty.update();
		this._currentController.setValue(ArrayFunctions.indexOfInArray(this._inputControllers, aControllerProperty));
		this._updateProperty.update();
		
		return this;
	};
	
	objectFunctions.deselectController = function(aControllerProperty) {
		
		var currentController = this._currentController.getValue();
		var removedController = ArrayFunctions.indexOfInArray(this._inputControllers, aControllerProperty);
		if(currentController === removedController) {
			this._updateProperty.update();
			this._currentController.setValue(this._defaultController);
			this._updateProperty.update();
		}
		
		return this;
	};
	
	objectFunctions._updateFlow = function() {
		console.log("com.developedbyme.flow.MultipleControllersSwitch::_updateFlow");
		
		var aCurrentController = this._currentController.getValueWithoutFlow();
		
		console.log(this._lastController, aCurrentController);
		
		if(this._lastController !== -1) {
			this._outputControllers[this._lastController].disconnectOutput(this._outputConnection);
			this._inputControllers[this._lastController].connectInput(this._inputConnection);
		}
		
		if(aCurrentController !== -1) {
			this._inputControllers[aCurrentController].disconnectInput(this._inputConnection);
			this._outputControllers[aCurrentController].connectOutput(this._outputConnection);
		}
		
		this._lastController = aCurrentController;
	};
	
	staticFunctions.create = function(aInputOutputConnection) {
		//console.log("com.developedbyme.flow.MultipleControllersSwitch::create");
		var newNode = (new ClassReference()).init();
		
		newNode.setInputConnection(aInputOutputConnection).setOutputConnection(aInputOutputConnection);
		
		return newNode;
	};
});