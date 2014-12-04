/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.manipulationreevaluation.ObjectReevaluationBaseObject");
	
	var CombineArraysObject = dbm.importClass("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject");
	
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject::_init");
		
		this.superCall();
		
		this.array1Reevaluator = null;
		this.array2Reevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var array1 = this.array1Reevaluator.reevaluate(aBaseObject);
		var array2 = this.array2Reevaluator.reevaluate(aBaseObject);
		
		return array1.concat(array2);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.array1Reevaluator = null;
		this.array2Reevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aArray1, aArray2) {
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.CombineArraysObject::createCommand (static)");
		var newCommand = (new CombineArraysObject()).init();
		
		newCommand.array1Reevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArray1);
		newCommand.array2Reevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aArray2);
		
		return newCommand;
	};
});