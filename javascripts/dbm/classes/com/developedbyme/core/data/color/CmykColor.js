/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A CMYK color.
 */
dbm.registerClass("com.developedbyme.core.data.color.CmykColor", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.color.CmykColor");
	
	//Self reference
	var CmykColor = dbm.importClass("com.developedbyme.core.data.color.CmykColor");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.color.CmykColor");
		
		this.superCall();
		
		this.c = 0;
		this.m = 0;
		this.y = 0;
		this.k = 0;
		
		return this;
	};
	
	objectFunctions.getCssString = function() {
		return "rgb(" + (100*(1-this.c)*(1-this.k)) + "%," + (100*(1-this.m)*(1-this.k)) + "%," + (100*(1-this.y)*(1-this.k)) + "%)";
	};
	
	objectFunctions.getSvgColorStopString = function() {
		return "rgb(" + (100*(1-this.c)*(1-this.k)) + "%," + (100*(1-this.m)*(1-this.k)) + "%," + (100*(1-this.y)*(1-this.k)) + "%)";
	};
	
	objectFunctions.getSvgColorStopOpacityString = function() {
		return "1";
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("c: " + this.c);
		aReturnArray.push("m: " + this.m);
		aReturnArray.push("y: " + this.y);
		aReturnArray.push("k: " + this.k);
	};
	
	staticFunctions.create = function(aC, aM, aY, aK) {
		//console.log("com.developedbyme.core.data.color.CmykColor::create (static)");
		//console.log(aC, aM, aY, aK);
		var newCmykColor = (new CmykColor()).init();
		ClassReference.setValuesToColor(newCmykColor, aC, aM, aY, aK);
		
		return newCmykColor;
	};
	
	staticFunctions.setValuesToColor = function(aColor, aC, aM, aY, aK) {
		aColor.c = VariableAliases.valueWithDefault(aC, 0);
		aColor.m = VariableAliases.valueWithDefault(aM, 0);
		aColor.y = VariableAliases.valueWithDefault(aY, 0);
		aColor.k = VariableAliases.valueWithDefault(aK, 0);
	};
});