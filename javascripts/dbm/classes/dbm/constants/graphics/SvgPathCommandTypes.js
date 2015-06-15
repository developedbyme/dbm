/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.graphics.SvgPathCommandTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.graphics.SvgPathCommandTypes");
	//"use strict";
	
	var SvgPathCommandTypes = dbm.importClass("dbm.constants.graphics.SvgPathCommandTypes");
	
	staticFunctions.MOVE_TO = "M";
	staticFunctions.MOVE_TO_RELATIVE = "m";
	
	staticFunctions.LINE_TO = "L";
	staticFunctions.LINE_TO_RELATIVE = "l";
	staticFunctions.HORIZONTAL_LINE_TO = "H";
	staticFunctions.HORIZONTAL_LINE_TO_RELATIVE = "h";
	staticFunctions.VERTICAL_LINE_TO = "V";
	staticFunctions.VERTICAL_LINE_TO_RELATIVE = "v";
	
	staticFunctions.CUBIC_CURVE_TO = "C";
	staticFunctions.CUBIC_CURVE_TO_RELATIVE = "c";
	staticFunctions.SHORTHAND_CUBIC_CURVE_TO = "S";
	staticFunctions.SHORTHAND_CUBIC_CURVE_TO_RELATIVE = "s";
	
	staticFunctions.QUADRATIC_CURVE_TO = "Q";
	staticFunctions.QUADRATIC_CURVE_TO_RELATIVE = "q";
	staticFunctions.SHORTHAND_QUADRATIC_CURVE_TO = "T";
	staticFunctions.SHORTHAND_QUADRATIC_CURVE_TO_RELATIVE = "t";
	
	staticFunctions.ARC_TO = "A";
	staticFunctions.ARC_TO_RELATIVE = "a";
	
	staticFunctions.CLOSE_PATH = "Z";
	staticFunctions.CLOSE_PATH_RELATIVE = "z"; //MENOTE: no difference from CLOSE_PATH
});