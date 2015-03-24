/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject");
	
	//Self reference
	var CreateAndInitObjectReevaluationObject = dbm.importClass("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject");
	
	//Error report
	
	//Dependencies
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject::_init");
		
		this.superCall();
		
		this.classReevaluator = null;
		this.creationCommandsReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject::reevaluate");
		var theClass = this.classReevaluator.reevaluate(aBaseObject);
		
		var returnObject = new theClass();
		returnObject.init();
		
		var dataObject = EventDataObject.create(aBaseObject, this, returnObject);
		this.creationCommandsReevaluator.reevaluate(dataObject);
		dataObject.destroy();
		
		return returnObject;
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.classReevaluator);
		ClassReference.destroyIfExists(this.creationCommandsReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.classReevaluator = null;
		this.creationCommandsReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that encodes an object to a form url string.
	 * 
	 * @param	aClass	The class to create the object from.
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aClass, aCommandsArray) {
		//console.log("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject::createCommand (static)");
		
		if(!VariableAliases.isSet(aCommandsArray)) {
			aCommandsArray = new Array();
		}
		
		var newCommand = (new CreateAndInitObjectReevaluationObject()).init();
		
		newCommand.classReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aClass);
		newCommand.creationCommandsReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aCommandsArray);
		
		return newCommand;
	};
});