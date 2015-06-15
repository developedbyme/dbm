/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.template.InsertTemplatedArrayCommand", "dbm.core.extendedevent.commands.htmldom.BaseElementCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.template.InsertTemplatedArrayCommand");
	
	//Self reference
	var InsertTemplatedArrayCommand = dbm.importClass("dbm.core.extendedevent.commands.template.InsertTemplatedArrayCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var GetNamedArrayValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var QuerySelectorObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.template.InsertTemplatedArrayCommand::_init");
		
		this.superCall();
		
		this.templateReevaluator = null;
		this.arrayReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.template.InsertTemplatedArrayCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		var theTemplate = this.templateReevaluator.reevaluate(aEventDataObject);
		
		var currentArray = this.arrayReevaluator.reevaluate(aEventDataObject);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentData = currentArray[i];
			var newElement = theTemplate.createNewItem(currentData);
			theElement.appendChild(newElement);
		}
		
		return CommandStatusTypes.CONTINUE;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("template: " + this.templateReevaluator);
		aReturnArray.push("array: " + this.arrayReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.templateReevaluator);
		ClassReference.softDestroyIfExists(this.arrayReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.templateReevaluator = null;
		this.arrayReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aElement, aTemplate, aArray) {
		var newCommand = (new InsertTemplatedArrayCommand()).init();
		
		newCommand.elementReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		newCommand.templateReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTemplate);
		newCommand.arrayReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aArray);
		
		return newCommand;
	};
	
	staticFunctions.createOnTemplateOutputWithQueryCommand = function(aQuery, aTemplate, aArray) {
		return ClassReference.createCommand(QuerySelectorObject.createCommand(GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"), aQuery), aTemplate, aArray);
	};
});