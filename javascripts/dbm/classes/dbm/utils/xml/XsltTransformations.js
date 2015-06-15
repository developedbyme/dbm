/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.xml.XsltTransforamtions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.xml.XsltTransforamtions");
	
	var XsltTransforamtions = dbm.importClass("dbm.utils.xml.XsltTransforamtions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	staticFunctions.transformToFragment = function(aXmlData, aXsltDocument, aParameters, aDocument) {
		
		aDocument = VariableAliases.valueWithDefault(aDocument, document);
		
		var processor = new XSLTProcessor();
		processor.importStylesheet(aXsltDocument);
		
		if(VariableAliases.isSet(aParameters)) {
			for(var objectName in aParameters) {
				//METODO: check out how to implement namespaces
				processor.setParameter(null, objectName, aParameters[objectName]);
			}
		}
		
		return processor.transformToFragment(aXmlData, aDocument);
	};
	
	staticFunctions.transformToDocument = function(aXmlData, aXsltDocument, aParameters) {
		var processor = new XSLTProcessor();
		processor.importStylesheet(aXsltDocument);
		
		if(VariableAliases.isSet(aParameters)) {
			for(var objectName in aParameters) {
				//METODO: check out how to implement namespaces
				processor.setParameter(null, objectName, aParameters[objectName]);
			}
		}
		
		return processor.transformToDocument(aXmlData);
	};
});