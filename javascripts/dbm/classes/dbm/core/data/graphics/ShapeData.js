/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for drawing a vector shape.
 */
dbm.registerClass("dbm.core.data.graphics.ShapeData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.graphics.ShapeData");
	//"use strict";
	
	//Self reference
	var ShapeData = dbm.importClass("dbm.core.data.graphics.ShapeData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.graphics.ShapeData");
		
		this.superCall();
		
		this.stroke = null;
		this.fill = null;
		this.curves = new Array();
		this.strokeOverFill = true;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("stroke: " + this.stroke);
		aReturnArray.push("fill: " + this.fill);
		
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.core.data.graphics.ShapeData::create (static)");
		var newShapeData = ClassReference._createAndInitClass(ClassReference);
		
		return newShapeData;
	};
});