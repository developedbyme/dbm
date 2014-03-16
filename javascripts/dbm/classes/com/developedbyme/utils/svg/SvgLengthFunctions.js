/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.svg.SvgLengthFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.svg.SvgLengthFunctions");
	//"use strict";
	
	var SvgLengthFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgLengthFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ValueWithUnit = dbm.importClass("com.developedbyme.core.data.number.ValueWithUnit");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	staticFunctions._tempValueWithUnit = null;
	
	staticFunctions._getTempValueWithUnit = function() {
		if(ClassReference._tempValueWithUnit === null) {
			ClassReference._tempValueWithUnit = ValueWithUnit.create(0, UnitTypes.UNKNOWN);
		}
		return ClassReference._tempValueWithUnit;
	};
	
	staticFunctions.setAnimatedBaseValue = function(aAnimatableValue, aValue) {
		
		aAnimatableValue.baseVal = aValue;
	};
	
	staticFunctions.setAnimatedBaseValueWithUnit = function(aAnimatableValue, aValue, aDefaultUnitType) {
		
		var tempValueWithUnit = ClassReference._getTempValueWithUnit();
		ValueWithUnit.parseValue(aValue, tempValueWithUnit, aDefaultUnitType);
		
		aAnimatableValue.baseVal.newValueSpecifiedUnits(UnitTypes.getSvgUnitType(tempValueWithUnit.unitType), tempValueWithUnit.value);
	};
});