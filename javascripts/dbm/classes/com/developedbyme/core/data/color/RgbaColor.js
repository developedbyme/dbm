/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A RGBA color.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.data.color.RgbaColor", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.color.RgbaColor");
	
	//Self reference
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.color.RgbaColor");
		
		this.superCall();
		
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;
		
		return this;
	};
	
	objectFunctions.getCssString = function() {
		var alpha = this.a;
		if(alpha < 0.000001) {
			//MENOTE: css doesn't support 1.2345e-7 format
			alpha = 0;
		}
		return "rgba(" + (100*this.r) + "%," + (100*this.g) + "%," + (100*this.b) + "%," + (this.a) + ")";
	};
	
	objectFunctions.getSvgColorStopString = function() {
		return "rgb(" + (100*this.r) + "%," + (100*this.g) + "%," + (100*this.b) + "%)";
	};
	
	objectFunctions.getSvgColorStopOpacityString = function() {
		var alpha = this.a;
		if(alpha < 0.000001) {
			//MENOTE: css doesn't support 1.2345e-7 format
			alpha = 0;
		}
		return alpha.toString();
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("r: " + this.r);
		aReturnArray.push("g: " + this.g);
		aReturnArray.push("b: " + this.b);
		aReturnArray.push("a: " + this.a);
	};
	
	staticFunctions.create = function create(aR, aG, aB, aA) {
		//console.log("com.developedbyme.core.data.color.RgbaColor::create (static)");
		//console.log(aR, aG, aB, aA);
		var newRgbaColor = (new RgbaColor()).init();
		newRgbaColor.r = VariableAliases.valueWithDefault(aR, 0);
		newRgbaColor.g = VariableAliases.valueWithDefault(aG, 0);
		newRgbaColor.b = VariableAliases.valueWithDefault(aB, 0);
		newRgbaColor.a = VariableAliases.valueWithDefault(aA, 1);
		
		return newRgbaColor;
	};
});