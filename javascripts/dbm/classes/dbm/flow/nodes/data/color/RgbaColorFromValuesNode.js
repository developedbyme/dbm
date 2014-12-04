/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Sets values to a RgbaColor object.
 */
dbm.registerClass("dbm.flow.nodes.data.color.RgbaColorFromValuesNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.color.RgbaColorFromValuesNode");
	//"use strict";
	
	//Self reference
	var RgbaColorFromValuesNode = dbm.importClass("dbm.flow.nodes.data.color.RgbaColorFromValuesNode");
	
	//Error report
	
	//Dependencies
	var RgbaColor = dbm.importClass("dbm.core.data.color.RgbaColor");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.color.RgbaColorFromValuesNode::_init");
		
		this.superCall();
		
		this._red = this.createProperty("red", 0);
		this._green = this.createProperty("green", 0);
		this._blue = this.createProperty("blue", 0);
		this._alpha = this.createProperty("alpha", 1);
		this._outputColor = this.createProperty("outputColor", RgbaColor.create());
		
		this.createUpdateFunction("default", this._update, [this._red, this._green, this._blue, this._alpha], [this._outputColor]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.data.color.RgbaColorFromValuesNode::_update");
		
		var outputColor = this._outputColor.getValueWithoutFlow();
		
		RgbaColor.setValuesToColor(outputColor, this._red.getValueWithoutFlow(), this._green.getValueWithoutFlow(), this._blue.getValueWithoutFlow(), this._alpha.getValueWithoutFlow());
		this._outputColor.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._red = null;
		this._green = null;
		this._blue = null;
		this._alpha = null;
		this._outputColor = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aR, aG, aB, aA) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("red", aR);
		newNode.setPropertyInputWithoutNull("green", aG);
		newNode.setPropertyInputWithoutNull("blue", aB);
		newNode.setPropertyInputWithoutNull("alpha", aA);
		return newNode;
	};
});