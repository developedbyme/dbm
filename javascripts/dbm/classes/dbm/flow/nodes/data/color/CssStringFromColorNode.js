/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Gets a css string from a color.
 */
dbm.registerClass("dbm.flow.nodes.data.color.CssStringFromColorNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.color.CssStringFromColorNode");
	//"use strict";
	
	//Self reference
	var CssStringFromColorNode = dbm.importClass("dbm.flow.nodes.data.color.CssStringFromColorNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.color.CssStringFromColorNode::_init");
		
		this.superCall();
		
		this._color = this.createProperty("color", null).setAlwaysUpdateFlow(true);
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._color], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.data.color.CssStringFromColorNode::_update");
		
		var returnValue = null;
		var color = this._color.getValueWithoutFlow();
		
		if(color !== null) {
			returnValue = color.getCssString();
		}
		
		this._outputValue.setValueWithFlow(returnValue, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._color = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aColor) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("color", aColor);
		return newNode;
	};
});