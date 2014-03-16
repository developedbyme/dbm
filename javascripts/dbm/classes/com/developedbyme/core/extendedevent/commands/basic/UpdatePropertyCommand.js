/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand");
	
	var UpdatePropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand::perform");
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
		//console.log("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand::createCommand (static)");
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
		//console.log("com.developedbyme.core.extendedevent.commands.basic.UpdatePropertyCommand::createStartUpdatingPropertyOnObjectCommand (static)");
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