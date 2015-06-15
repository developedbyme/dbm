/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.htmldom.DomReferenceFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.htmldom.DomReferenceFunctions");
	
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	staticFunctions.getDocument = (function(aElementOrDocument) {
		//console.log("dbm.utils.htmldom.DomReferenceFunctions::getDocument (static)");
		return (aElementOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aElementOrDocument : aElementOrDocument.ownerDocument;
	});
	
	staticFunctions.getDocumentVisualParent = (function(aElementOrDocument) {
		//console.log("dbm.utils.htmldom.DomReferenceFunctions::getDocumentVisualParent (static)");
		return (aElementOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aElementOrDocument.body : aElementOrDocument;
	});
	
});