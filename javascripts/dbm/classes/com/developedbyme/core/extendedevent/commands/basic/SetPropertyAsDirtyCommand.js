dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::perform");
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
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::createCommand (static)");
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
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand::createSetPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName);
		var newCommand = (new SetPropertyAsDirtyCommand()).init();
		
		newCommand.propertyReevaluator = GetPropertyObject.createCommand(aObject, aPropertyName);
		
		return newCommand;
	};
});