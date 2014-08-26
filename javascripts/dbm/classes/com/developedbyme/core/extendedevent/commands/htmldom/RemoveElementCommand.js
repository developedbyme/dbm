/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand", "com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand");
	
	//Self reference
	var RemoveElementCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var QuerySelectorObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		
		if(!VariableAliases.isSet(theElement)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Element is null. Can't remove it.");
			return CommandStatusTypes.ERROR;
		}
		
		theElement.parentElement.removeChild(theElement);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	staticFunctions.createCommand = function(aElement) {
		var newCommand = (new RemoveElementCommand()).init();
		
		newCommand.elementReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		
		return newCommand;
	};
	
	staticFunctions.createOnTemplateOutputWithQueryCommand = function(aQuery) {
		return ClassReference.createCommand(QuerySelectorObject.createCommand(GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"), aQuery));
	};
});