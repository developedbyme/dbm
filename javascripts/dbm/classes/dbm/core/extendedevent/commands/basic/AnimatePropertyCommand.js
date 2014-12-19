/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand");
	
	//Self reference
	var AnimatePropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var GetPropertyObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand::_init");
		
		this.superCall();
		
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		this.timeReevaluator = null;
		this.interpolationReevaluator = null;
		this.delayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand::perform");
		//console.log(aEventDataObject);
		
		var theProperty = this.propertyReevaluator.reevaluate(aEventDataObject);
		var value = this.valueReevaluator.reevaluate(aEventDataObject);
		var time = this.timeReevaluator.reevaluate(aEventDataObject);
		var interpolation = this.interpolationReevaluator.reevaluate(aEventDataObject);
		var delay = this.delayReevaluator.reevaluate(aEventDataObject);
		
		theProperty.animateValue(value, time, interpolation, delay);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.propertyReevaluator);
		ClassReference.softDestroyIfExists(this.valueReevaluator);
		ClassReference.softDestroyIfExists(this.timeReevaluator);
		ClassReference.softDestroyIfExists(this.interpolationReevaluator);
		ClassReference.softDestroyIfExists(this.delayReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.propertyReevaluator = null;
		this.valueReevaluator = null;
		this.timeReevaluator = null;
		this.interpolationReevaluator = null;
		this.delayReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that starts updating a property.
	 * 
	 * @param	aProperty	The property to animate.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aProperty, aValue, aTime, aInterpolation, aDelay) {
		//console.log("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand::createCommand (static)");
		//console.log(aProperty, aValue, aTime, aInterpolation, aDelay);
		
		aInterpolation = VariableAliases.valueWithDefault(aInterpolation, InterpolationTypes.LINEAR);
		aDelay = VariableAliases.valueWithDefault(aDelay, 0);
		
		var newCommand = (new AnimatePropertyCommand()).init(aProperty);
		
		newCommand.propertyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aProperty);
		newCommand.valueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aValue);
		newCommand.timeReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTime);
		newCommand.interpolationReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInterpolation);
		newCommand.delayReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aDelay);
		
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
	staticFunctions.createStartUpdatingPropertyOnObjectCommand = function(aObject, aPropertyName, aValue, aTime, aInterpolation, aDelay) {
		//console.log("dbm.core.extendedevent.commands.basic.AnimatePropertyCommand::createStartUpdatingPropertyOnObjectCommand (static)");
		//console.log(aObject, aPropertyName, aValue);
		return ClassReference.createCommand(GetPropertyObject.createCommand(aObject, aPropertyName), aValue, aTime, aInterpolation, aDelay);
	};
	
	/**
	 * Creates a command that starts updating a property on the performing object.
	 * 
	 * @param	aPropertyName	The name of the property.
	 * @param	aStart			If the updates should start or stop.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createStartUpdatingPropertyOnPerformingObjectCommand = function(aPropertyName, aValue, aTime, aInterpolation, aDelay) {
		return ClassReference.createStartUpdatingPropertyOnObjectCommand(GetVariableObject.createSelectPerformingObjectCommand(), aPropertyName, aValue, aTime, aInterpolation, aDelay);
	};
});