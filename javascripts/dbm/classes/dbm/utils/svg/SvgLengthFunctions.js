/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.svg.SvgLengthFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.svg.SvgLengthFunctions");
	//"use strict";
	
	var SvgLengthFunctions = dbm.importClass("dbm.utils.svg.SvgLengthFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ValueWithUnit = dbm.importClass("dbm.core.data.number.ValueWithUnit");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var UnitTypes = dbm.importClass("dbm.constants.css.UnitTypes");
	
	staticFunctions._tempValueWithUnit = null;
	
	staticFunctions._getTempValueWithUnit = function() {
		if(ClassReference._tempValueWithUnit === null) {
			ClassReference._tempValueWithUnit = ValueWithUnit.create(0, UnitTypes.UNKNOWN);
		}
		return ClassReference._tempValueWithUnit;
	};
	
	staticFunctions.setAnimatedBaseValue = function(aAnimatableValue, aValue) {
		//console.log("dbm.utils.svg.SvgLengthFunctions::setAnimatedBaseValue");
		//console.log(aAnimatableValue, aValue);
		
		aAnimatableValue.baseVal = aValue;
	};
	
	staticFunctions.setAnimatedBaseValueWithUnit = function(aAnimatableValue, aValue, aDefaultUnitType) {
		
		var tempValueWithUnit = ClassReference._getTempValueWithUnit();
		ValueWithUnit.parseValue(aValue, tempValueWithUnit, aDefaultUnitType);
		
		aAnimatableValue.baseVal.newValueSpecifiedUnits(UnitTypes.getSvgUnitType(tempValueWithUnit.unitType), tempValueWithUnit.value);
	};
});