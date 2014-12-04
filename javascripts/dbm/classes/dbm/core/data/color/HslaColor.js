/**
 * A HSLA color.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.data.color.HslaColor", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.color.HslaColor");
	
	var HslaColor = dbm.importClass("dbm.core.data.color.HslaColor");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions._init = function _init() {
		//console.log("dbm.core.data.color.HslaColor");
		
		this.superCall();
		
		this.h = 0;
		this.s = 0;
		this.l = 0;
		this.a = 1;
		
		return this;
	};
	
	objectFunctions.getCssString = function getCssString() {
		var alpha = this.a;
		if(alpha < 0.000001) {
			//MENOTE: css doesn't support 1.2345e-7 format
			alpha = 0;
		}
		return "hsla(" + (360*this.h) + "," + (100*this.s) + "%," + (100*this.l) + "%," + (alpha) + ")";
	};
	
	objectFunctions.getSvgColorStopString = function() {
		return "hsl(" + (360*this.h) + "," + (100*this.s) + "%," + (100*this.l)  + "%)";
	};
	
	objectFunctions.getSvgColorStopOpacityString = function() {
		var alpha = this.a;
		if(alpha < 0.000001) {
			//MENOTE: css doesn't support 1.2345e-7 format
			alpha = 0;
		}
		return alpha.toString();
	};
	
	staticFunctions.create = function create(aH, aS, aL, aA) {
		//console.log("dbm.core.data.color.HslaColor::create (static)");
		//console.log(aH, aS, aL, aA);
		var newHslaColor = (new HslaColor()).init();
		newHslaColor.r = VariableAliases.valueWithDefault(aH, 0);
		newHslaColor.g = VariableAliases.valueWithDefault(aS, 0);
		newHslaColor.b = VariableAliases.valueWithDefault(aL, 0);
		newHslaColor.a = VariableAliases.valueWithDefault(aA, 1);
		
		return newHslaColor;
	};
});