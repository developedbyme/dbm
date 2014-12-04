/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject");
	//"use strict";
	
	//Self reference
	var InstanceOfClassObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.classReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theClass = this.classReevaluator.reevaluate(aBaseObject);
		return (theObject instanceof theClass);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.objectReevaluator = null;
		this.classReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aObject, aClass) {
		//console.log("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject::createCommand (static)");
		var newCommand = (new InstanceOfClassObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.classReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aClass);
		
		return newCommand;
	};
});