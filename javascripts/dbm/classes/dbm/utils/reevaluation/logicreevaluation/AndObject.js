/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.logicreevaluation.AndObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject");
	//"use strict";
	
	//Self reference
	var AndObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.AndObject");
	
	//Error report
	
	//Dependencies
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.logicreevaluation.AndObject::_init");
		
		this.superCall();
		
		this.reevaluators = this.addDestroyableObject(ArrayHolder.create(true));
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.logicreevaluation.AndObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var currentArray = this.reevaluators.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentReevaluator = currentArray[i];
			var currentResult = currentReevaluator.reevaluate(aBaseObject);
			if(!currentResult) {
				return false;
			}
		}
		
		return true;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluators = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(/* ... aArguments */) {
		//console.log("dbm.utils.reevaluation.logicreevaluation.AndObject::createCommand (static)");
		
		var aArguments = arguments;
		
		var newCommand = (new AndObject()).init();
		
		var currentArray = aArguments;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newCommand.reevaluators.array.push(ReevaluationCreator.reevaluationOrStaticValue(currentArray[i]));
		}
		
		return newCommand;
	};
});