/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Utils for manipulating the DOM in a secure way.
 */
dbm.registerClass("com.developedbyme.utils.htmldom.DomManipulationFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	//Self reference
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions.importNode = function(aElement, aDeep, aDocument) {
		//console.log("com.developedbyme.utils.htmldom.DomManipulationFunctions::importNode");
		//console.log(aElement, aDeep, aDocument);
		
		try {
			return aDocument.importNode(aElement, aDeep);
		}
		catch(theError) {
			//MENOTE: MSIE has the function but can't use it
			var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aDocument);
			var newFragment;
			if(aDeep) {
				newFragment = htmlCreator.createFromTemplate(aElement.outerHTML);
			}
			else {
				//METODO
			}
			
			return newFragment.firstChild;
		}
	};
	
	staticFunctions.cloneNode = function(aElement, aDeep) {
		try {
			return aElement.cloneNode(aDeep);
		}
		catch(theError) {
			//MENOTE: MSIE has the function but can't use it
			var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aElement.ownerDocument);
			var newFragment;
			if(aDeep) {
				newFragment = htmlCreator.createFromTemplate(aElement.outerHTML);
			}
			else {
				//METODO
			}
			
			return newFragment.firstChild;
		}
	};
	
	staticFunctions.adoptNode = function(aElement, aDocument) {
		try {
			return aDocument.adoptNode(aElement);
		}
		catch(theError) {
			var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aDocument);
			var newFragment = htmlCreator.createFromTemplate(aElement.outerHTML);
			var currentNode = aElement;
			var currentExportNode = newFragment.firstChild;
			//METODO
			return newFragment.firstChild;
		}
		
	};
	
	staticFunctions.insertAtPosition = function(aElement, aParentNode, aPosition) {
		var children = aParentNode.children;
		if(children.length <= aPosition) {
			//MENOTE: should there be a warning if the array position is further in than the length?
			aParentNode.appendChild(aElement);
		}
		else {
			aParentNode.insertBefore(aElement, children[aPosition]);
		}
	};
	
	staticFunctions.ensureCorrectDocumentForNode = function(aElement, aDocument) {
		if(aElement.ownerDocument !== aDocument) {
			try{
				aDocument.adoptNode(aElement);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[DomManipulationFunctions]", "ensureCorrectDocumentForNode", "Un error occured while adopting node.");
				ErrorManager.getInstance().reportError("[DomManipulationFunctions]", "ensureCorrectDocumentForNode", theError);
			}
		}
	};
	
	staticFunctions.addToParent = function(aElement, aParentElement) {
		if(aElement.parentNode !== aParentElement) {
			ClassReference.ensureCorrectDocumentForNode(aElement, aParentElement.ownerDocument);
			
			try{
				aParentElement.appendChild(aElement);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[DomManipulationFunctions]", "addToParent", "Un error occured while adding " + aElement + " to " + aParentElement + ".");
				ErrorManager.getInstance().reportError("[DomManipulationFunctions]", "addToParent", theError);
			}
		}
	};
	
	staticFunctions.removeFromParent = function(aElement) {
		if(aElement.parentNode !== null) {
			try{
				aElement.parentNode.removeChild(aElement);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[DomManipulationFunctions]", "removeFromParent", "Un error occured while removing " + aElement + " from dom.");
				ErrorManager.getInstance().reportError("[DomManipulationFunctions]", "removeFromParent", theError);
			}
		}
	};
	
	staticFunctions.setElementDomStatus = function(aElement, aParentElement, aInDom) {
		if(aElement !== null) {
			if(aInDom && aParentElement !== null) {
				ClassReference.addToParent(aElement, aParentElement);
				return true;
			}
			ClassReference.removeFromParent(aElement);
		}
		return false;
	};
});