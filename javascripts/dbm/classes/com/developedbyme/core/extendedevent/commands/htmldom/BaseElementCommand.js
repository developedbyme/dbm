/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand");
	
	//Self reference
	var BaseElementCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand::_init");
		
		this.superCall();
		
		this.elementReevaluator = null;
		
		return this;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("element: " + this.elementReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.elementReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.elementReevaluator = null;
		
		this.superCall();
	};
});