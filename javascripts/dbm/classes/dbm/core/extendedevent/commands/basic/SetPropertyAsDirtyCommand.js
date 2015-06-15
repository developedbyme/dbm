/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var SetPropertyAsDirtyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::perform");
		//console.log(aEventDataObject);
		
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		theProperty.setAsDirty();
		
		//console.log(theProperty.name, theProperty);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that sets a property as dirty.
	 * 
	 * @param	aProperty	The property to set.
	 * @param	aValue		The value to set to the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aProperty) {
		//console.log("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::createCommand (static)");
		//console.log(aProperty);
		var newCommand = (new SetPropertyAsDirtyCommand()).init();
		
		newCommand.propertyReevaluator = StaticVariableObject.createReevaluationObject(aProperty);
		
		return newCommand;
	};
	
	/**
	 * Creates a command that sets a property as dirty on an object.
	 * 
	 * @param	aObject			The object to set the property on.
	 * @param	aPropertyName	The name of the property.
	 * @param	aValue			The value to set to the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createSetPropertyOnObjectCommand = function(aObject, aPropertyName) {
		//console.log("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::createSetPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName);
		var newCommand = (new SetPropertyAsDirtyCommand()).init();
		
		newCommand.propertyReevaluator = GetPropertyObject.createCommand(aObject, aPropertyName);
		
		return newCommand;
	};
});