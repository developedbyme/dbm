/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.switchablearea.SwitchableAreaHolder", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SwitchableAreaHolder = dbm.importClass("dbm.gui.abstract.switchablearea.SwitchableAreaHolder");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.switchablearea.SwitchableAreaHolder::_init");
		
		this.superCall();
		
		this._swichableArea = null;
		this._visibleArea = this.createProperty("visibleArea", null);
		
		return this;
	};
	
	objectFunctions.setSwitchableArea = function(aSwitchableArea) {
		this._swichableArea = aSwitchableArea;
		this._swichableArea.setPropertyInput("visibleArea", this._visibleArea);
		
		return this;
	};
	
	objectFunctions.getSwitchableArea = function() {
		return this._swichableArea;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._swichableArea = null;
		this._visibleArea = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return ClassReference._createAndInitClassWithElement(ClassReference, aElement);
	};
});