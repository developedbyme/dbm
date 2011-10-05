dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand::init");
		
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
		
		ClassReference.softDestroyIfExist(this.propertyReevaluator);
		ClassReference.softDestroyIfExist(this.valueReevaluator);
		
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
		
		if(aProperty instanceof ReevaluationBaseObject) {
			newCommand.propertyReevaluator = aProperty;
		}
		else {
			newCommand.propertyReevaluator = StaticVariableObject.createReevaluationObject(aProperty);
		}
		
		if(aValue instanceof ReevaluationBaseObject) {
			newCommand.valueReevaluator = aValue;
		}
		else {
			newCommand.valueReevaluator = StaticVariableObject.createReevaluationObject(aValue);
		}
		
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
		var newCommand = (new SetPropertyCommand()).init();
		
		newCommand.propertyReevaluator = GetPropertyObject.createCommand(aObject, aPropertyName);
		
		if(aValue instanceof ReevaluationBaseObject) {
			newCommand.valueReevaluator = aValue;
		}
		else {
			newCommand.valueReevaluator = StaticVariableObject.createReevaluationObject(aValue);
		}
		
		return newCommand;
	};
});