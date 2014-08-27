/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand", "com.developedbyme.core.extendedevent.commands.htmldom.BaseElementCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand");
	
	//Self reference
	var RebaseDocumentLinksCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand");
	
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
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand::_init");
		
		this.superCall();
		
		this.urlResolverReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand::perform");
		//console.log(this, aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		var urlResolver = this.urlResolverReevaluator.reevaluate(aEventDataObject);
		
		if(!VariableAliases.isSet(theElement)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Element is null. Can't rebase links.");
			return CommandStatusTypes.ERROR;
		}
		
		this._rebaseAttributeOnElements(theElement.querySelectorAll("link"), "href", urlResolver);
		this._rebaseAttributeOnElements(theElement.querySelectorAll("a"), "href", urlResolver);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	objectFunctions._rebaseAttributeOnElements = function(aArray, aAttributeName, aUrlResolver) {
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			if(currentElement.hasAttribute(aAttributeName)) {
				currentElement.setAttribute(aAttributeName, aUrlResolver.getRelativePath(currentElement.getAttribute(aAttributeName)));
			}
		}
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("urlResolver: " + this.urlResolverReevaluator);
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.urlResolverReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.urlResolverReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aElement, aUrlResolver) {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand::createCommand");
		//console.log(aElement, aUrlResolver);
		
		var newCommand = (new RebaseDocumentLinksCommand()).init();
		
		newCommand.elementReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		newCommand.urlResolverReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aUrlResolver);
		
		return newCommand;
	};
	
	staticFunctions.createOnTemplateOutputCommand = function(aUrlResolver) {
		//console.log("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand::createOnTemplateOutputCommand");
		//console.log(aUrlResolver);
		
		return ClassReference.createCommand(GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"), aUrlResolver);
	};
});