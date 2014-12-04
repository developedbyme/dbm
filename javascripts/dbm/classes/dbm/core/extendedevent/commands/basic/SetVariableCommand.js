/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.basic.SetVariableCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.basic.SetVariableCommand");
	
	//Self reference
	var SetVariableCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetVariableCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.basic.SetVariableCommand::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.basic.SetVariableCommand::perform");
		//console.log(aEventDataObject);
		
		var theObject = this.objectReevaluator.reevaluate(aEventDataObject);
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		var theValue = this.valueReevaluator.reevaluate(aEventDataObject);
		theObject[theProperty] = theValue;
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.objectReevaluator);
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		ClassReference.softDestroyIfExists(this.valueReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.objectReevaluator = null;
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that sets a variable on an object.
	 * 
	 * @param	aObject		The object to set the variable on
	 * @param	aProperty	The property to set.
	 * @param	aValue		The value to set to the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aProperty, aValue) {
		//console.log("dbm.core.extendedevent.commands.basic.SetVariableCommand::createCommand (static)");
		//console.log(aObject, aPropertyName, aValue);
		var newCommand = (new SetVariableCommand()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.propertyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aProperty);
		newCommand.valueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aValue);
		
		return newCommand;
	};
});