/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	
	//Self reference
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand::perform");
		//console.log(aEventDataObject);
		
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		var theValue = this.valueReevaluator.reevaluate(aEventDataObject);
		theProperty.setValue(theValue);
		
		//console.log(theProperty.name, theProperty, theValue);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		ClassReference.softDestroyIfExists(this.valueReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that sets a property.
	 * 
	 * @param	aProperty	The property to set.
	 * @param	aValue		The value to set to the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aProperty, aValue) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand::createCommand (static)");
		//console.log(aProperty, aValue);
		var newCommand = (new SetPropertyCommand()).init();
		
		newCommand.propertyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aProperty);
		newCommand.valueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aValue);
		
		return newCommand;
	};
	
	/**
	 * Creates a command that sets a property on an object.
	 * 
	 * @param	aObject			The object to set the property on.
	 * @param	aPropertyName	The name of the property.
	 * @param	aValue			The value to set to the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createSetPropertyOnObjectCommand = function(aObject, aPropertyName, aValue) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand::createSetPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName, aValue);
		
		return ClassReference.createCommand(GetPropertyObject.createCommand(aObject, aPropertyName), aValue);
	};
});