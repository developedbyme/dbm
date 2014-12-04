/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.htmldom.SetTextContentCommand", "dbm.core.extendedevent.commands.htmldom.BaseElementCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.htmldom.SetTextContentCommand");
	
	//Self reference
	var SetTextContentCommand = dbm.importClass("dbm.core.extendedevent.commands.htmldom.SetTextContentCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var GetNamedArrayValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var QuerySelectorObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.htmldom.SetTextContentCommand::_init");
		
		this.superCall();
		
		this.textReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.htmldom.SetTextContentCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		var theText = this.textReevaluator.reevaluate(aEventDataObject);
		
		if(!VariableAliases.isSet(theElement)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Element is null. Can't set text content to " + theText);
			return CommandStatusTypes.ERROR;
		}
		
		theElement.textContent = theText;
		
		return CommandStatusTypes.CONTINUE;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("text: " + this.textReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.textReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.textReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aElement, aText) {
		var newCommand = (new SetTextContentCommand()).init();
		
		newCommand.elementReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		newCommand.textReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aText);
		
		return newCommand;
	};
	
	staticFunctions.createOnTemplateOutputWithQueryCommand = function(aQuery, aText) {
		return ClassReference.createCommand(QuerySelectorObject.createCommand(GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"), aQuery), aText);
	};
});