/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand");
	
	//Self reference
	var StartUpdatingPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		this.startReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand::perform");
		//console.log(aEventDataObject);
		
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		var start = this.startReevaluator.reevaluate(aEventDataObject);
		if(start) {
			theProperty.startUpdating();
		}
		else {
			theProperty.stopUpdating();
		}
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		ClassReference.softDestroyIfExists(this.startReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyReevaluator = null;
		this.startReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that starts updating a property.
	 * 
	 * @param	aProperty	The property to set.
	 * @param	aStart		If the updates should start or stop.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aProperty, aStart) {
		//console.log("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand::createCommand (static)");
		//console.log(aProperty, aValue);
		
		aStart = VariableAliases.valueWithDefault(aStart, true);
		
		var newCommand = (new StartUpdatingPropertyCommand()).init(aProperty);
		
		newCommand.propertyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aProperty);
		newCommand.startReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aStart);
		
		return newCommand;
	};
	
	/**
	 * Creates a command that starts updating a property on an object.
	 * 
	 * @param	aObject			The object to set the property on.
	 * @param	aPropertyName	The name of the property.
	 * @param	aStart			If the updates should start or stop.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createStartUpdatingPropertyOnObjectCommand = function(aObject, aPropertyName, aStart) {
		//console.log("dbm.core.extendedevent.commands.basic.StartUpdatingPropertyCommand::createStartUpdatingPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName, aValue);
		return ClassReference.createCommand(GetPropertyObject.createCommand(aObject, aPropertyName), aStart);
	};
	
	/**
	 * Creates a command that starts updating a property on the performing object.
	 * 
	 * @param	aPropertyName	The name of the property.
	 * @param	aStart			If the updates should start or stop.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createStartUpdatingPropertyOnPerformingObjectCommand = function(aPropertyName, aStart) {
		return ClassReference.createStartUpdatingPropertyOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aPropertyName, aStart);
	};
});