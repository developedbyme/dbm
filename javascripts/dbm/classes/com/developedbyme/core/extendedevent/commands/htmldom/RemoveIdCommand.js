/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand", "com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand");
	
	//Self reference
	var RemoveIdCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		
		theElement.id = null;
		theElement.removeAttribute("id");
		
		return CommandStatusTypes.CONTINUE;
	};
	
	staticFunctions.createCommand = function(aElement) {
		var newCommand = (new RemoveIdCommand()).init();
		
		newCommand.elementReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		
		return newCommand;
	};
	
	staticFunctions.createOnTemplateOutputCommand = function() {
		return ClassReference.createCommand(GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"));
	};
});