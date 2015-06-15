/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand");
	
	var UpdatePropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand::perform");
		//console.log(aEventDataObject);
		
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		theProperty.update();
		
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
	 * Creates a command that updates a property.
	 * 
	 * @param	aProperty	The property to set.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aProperty) {
		//console.log("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand::createCommand (static)");
		//console.log(aProperty, aValue);
		
		var newCommand = (new UpdatePropertyCommand()).init();
		
		if(aProperty instanceof ReevaluationBaseObject) {
			newCommand.propertyReevaluator = aProperty;
		}
		else {
			newCommand.propertyReevaluator = StaticVariableObject.createReevaluationObject(aProperty);
		}
		
		return newCommand;
	};
	
	/**
	 * Creates a command that updates a property on an object.
	 * 
	 * @param	aObject			The object to set the property on.
	 * @param	aPropertyName	The name of the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createUpdatePropertyOnObjectCommand = function(aObject, aPropertyName) {
		//console.log("dbm.core.extendedevent.commands.basic.UpdatePropertyCommand::createStartUpdatingPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName, aValue);
		return ClassReference.createCommand(GetPropertyObject.createCommand(aObject, aPropertyName));
	};
	
	/**
	 * Creates a command that updates a property on the performing object.
	 * 
	 * @param	aPropertyName	The name of the property.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createUpdatePropertyOnPerformingObjectCommand = function(aPropertyName) {
		return ClassReference.createUpdatePropertyOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aPropertyName);
	};
});