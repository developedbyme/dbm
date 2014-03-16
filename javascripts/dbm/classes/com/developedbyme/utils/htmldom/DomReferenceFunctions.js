/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.htmldom.DomReferenceFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions.getDocument = (function(aElementOrDocument) {
		//console.log("com.developedbyme.utils.htmldom.DomReferenceFunctions::getDocument (static)");
		return (aElementOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aElementOrDocument : aElementOrDocument.ownerDocument;
	});
	
	staticFunctions.getDocumentVisualParent = (function(aElementOrDocument) {
		//console.log("com.developedbyme.utils.htmldom.DomReferenceFunctions::getDocumentVisualParent (static)");
		return (aElementOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aElementOrDocument.body : aElementOrDocument;
	});
	
});