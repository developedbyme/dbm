dbm.registerClass("com.developedbyme.utils.htmldom.DomManipulationFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions.importNode = (function(aElement, aDeep, aDocument) {
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
	});
	
	staticFunctions.cloneNode = (function(aElement, aDeep) {
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
	});
	
	staticFunctions.adoptNode = (function(aElement, aDocument) {
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
		
	});
	
	staticFunctions.insertAtPosition = (function(aElement, aParentNode, aPosition) {
		var children = aParentNode.children;
		if(children.length <= aPosition) {
			//MENOTE: should there be a warning if the array position is further in than the length?
			aParentNode.appendChild(aElement);
		}
		else {
			aParentNode.insertBefore(aElement, children[aPosition]);
		}
	});
});