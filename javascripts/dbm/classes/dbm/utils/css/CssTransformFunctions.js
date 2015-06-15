/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.css.CssTransformFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.css.CssTransformFunctions");
	//"use strict";
	
	//Self reference
	var CssTransformFunctions = dbm.importClass("dbm.utils.css.CssTransformFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var UnitTypes = dbm.importClass("dbm.constants.css.UnitTypes");
	var RotationOrderTypes = dbm.importClass("dbm.constants.graphics.RotationOrderTypes");
	
	staticFunctions._tempTransformArray = new Array(9);
	
	staticFunctions.generateFunctionString = function(aName, aValue, aUnit) {
		if(!VariableAliases.isSet(aValue)) {
			return null;
		}
		
		aUnit = VariableAliases.valueWithDefault(aUnit, "");
		if(aUnit === UnitTypes.NONE) {
			aUnit = "";
		}
		
		return aName + "(" + aValue + "" + aUnit + ")";
	};
	
	staticFunctions.generatePerspectiveString = function(aPerspective, aUnit) {
		return ClassReference.generateFunctionString("perspective", aPerspective, VariableAliases.valueWithDefault(aUnit, UnitTypes.PX));
	};
	
	staticFunctions.generateFullTransformString = function(aX, aY, aZ, aScaleX, aScaleY, aScaleZ, aRotateX, aRotateY, aRotateZ, aRotationOrder) {
		//console.log("dbm.utils.css.CssTransformFunctions::generateFullTransformString");
		//console.log(aX, aY, aZ, aScaleX, aScaleY, aScaleZ, aRotateX, aRotateY, aRotateZ, aRotationOrder);
		
		var transformArray = ClassReference._tempTransformArray;
		transformArray[0] = ClassReference.generateFunctionString("translateX", aX, UnitTypes.PX);
		transformArray[1] = ClassReference.generateFunctionString("translateY", aY, UnitTypes.PX);
		transformArray[2] = ClassReference.generateFunctionString("translateZ", aZ, UnitTypes.PX);
		
		var orderArray;
		switch(aRotationOrder) {
			default:
				//METODO: error message
			case RotationOrderTypes.XYZ:
				orderArray = [0, 1, 2];
				break;
			case RotationOrderTypes.XZY:
				orderArray = [0, 2, 1];
				break;
			case RotationOrderTypes.YXZ:
				orderArray = [1, 0, 2];
				break;
			case RotationOrderTypes.YZX:
				orderArray = [2, 0, 1];
				break;
			case RotationOrderTypes.ZXY:
				orderArray = [1, 2, 0];
				break;
			case RotationOrderTypes.ZYX:
				orderArray = [2, 1, 0];
				break;
		}
		
		transformArray[3+orderArray[0]] = ClassReference.generateFunctionString("rotateX", (180*aRotateX/Math.PI), UnitTypes.DEGREE);
		transformArray[3+orderArray[1]] = ClassReference.generateFunctionString("rotateY", (180*aRotateY/Math.PI), UnitTypes.DEGREE);
		transformArray[3+orderArray[2]] = ClassReference.generateFunctionString("rotateZ", (180*aRotateZ/Math.PI), UnitTypes.DEGREE);
		
		transformArray[6] = ClassReference.generateFunctionString("scaleX", aScaleX, UnitTypes.NONE);
		transformArray[7] = ClassReference.generateFunctionString("scaleY", aScaleY, UnitTypes.NONE);
		transformArray[8] = ClassReference.generateFunctionString("scaleZ", aScaleZ, UnitTypes.NONE);
		
		return transformArray.join(" ");
	};
	
	staticFunctions.combineTransformString = function(/* ... currentArray */) {
		var returnString = "";
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(i !== 0) {
				returnString += " ";
			}
			returnString += currentArray[i];
		}
		return returnString;
	};
});