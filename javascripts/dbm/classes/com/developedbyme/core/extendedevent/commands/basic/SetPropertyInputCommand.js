/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand");
	
	//Self reference
	var SetPropertyInputCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var GetPropertyObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand::_init");
		
		this.superCall();
		
		this.inputValueReevaluator = null;
		this.propertyReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.basic.SetPropertyInputCommand::perform");
		//console.log(this, aEventDataObject);
		
		var inputValue = this.inputValueReevaluator.reevaluate(aEventDataObject);
		var property = this.propertyReevaluator.reevaluate(aEventDataObject);
		
		if(!(property instanceof Property)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", property + " is not a property.");
			aEventDataObject.addResult(null);
			return CommandStatusTypes.ERROR;
		}
		
		dbm.singletons.dbmFlowManager.setPropertyInput(property, inputValue);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("inputValue: " + this.inputValueReevaluator);
		aReturnArray.push("property: " + this.propertyReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.inputValueReevaluator);
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.inputValueReevaluator = null;
		this.propertyReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aProperty, aInputValue) {
		var newCommand = (new SetPropertyInputCommand()).init();
		
		newCommand.propertyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aProperty);
		newCommand.inputValueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue);
		
		return newCommand;
	};
	
	staticFunctions.createOnObjectCommand = function(aObject, aPropertyName, aInputValue) {
		return ClassReference.createCommand(GetPropertyObject.createCommand(aObject, aPropertyName), aInputValue);
	};
	
	staticFunctions.createOnPerformingObjectCommand = function(aInputValue) {
		return ClassReference.createOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aInputValue);
	};
});