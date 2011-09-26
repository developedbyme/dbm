dbm.registerClass("com.developedbyme.utils.xml.XmlCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.xml.XmlCreator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	staticFunctions.createXmlLoader = (function() {
		var returnLoader;
		
		if (window.XMLHttpRequest) {
			returnLoader = new XMLHttpRequest();
		}
		else {// for IE 5/6
  			returnLoader = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		return returnLoader;
	});
	
	staticFunctions.loadXmlFile = (function(aPath) {
		var xmlLoader = ClassReference.createXmlLoader();
		
		var returnDocument = null;
		
		try {
			xmlLoader.open("GET", aPath, false);
			xmlLoader.send();
			returnDocument = xmlLoader.responseXML;
		}
		catch(theError) {
			ErrorManager.getInstance().reportError("[XmlCreator]", "loadXmlFile", theError);
			return null;
		}
		
		return returnDocument;
	});
	
	staticFunctions.loadXmlFileWithPost = (function(aPath, aParameters) {
		var xmlLoader = ClassReference.createXmlLoader();
		
		var returnDocument = null;
		
		try {
			xmlLoader.open("POST", aPath, false);
			xmlLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlLoader.setRequestHeader("Content-length", aParameters.length);
			xmlLoader.setRequestHeader("Connection", "close");
			xmlLoader.send(aParameters);
			returnDocument = xmlLoader.responseXML;
		}
		catch(theError) {
			ErrorManager.getInstance().reportError("[XmlCreator]", "loadXmlFileWithPost", theError);
			return null;
		}
		
		return returnDocument;
	});
	
	staticFunctions.createXmlFromString = (function(aText) {
		var returnDocument;
		if (window.DOMParser) {
			var parser = new DOMParser();
			returnDocument = parser.parseFromString(aText, "text/xml");
		}
		else {// Internet Explorer
			returnDocument = new ActiveXObject("Microsoft.XMLDOM");
			returnDocument.async = "false";
			returnDocument.loadXML(aText);
		} 
		
		return returnDocument;
	});
	
	staticFunctions.createStringFromXml = (function XMLtoString(aNode){
		if(window.XMLSerializer) {
			var serializer = new XMLSerializer();
			return serializer.serializeToString(aNode);
		}
		else {
			return aNode.xml;
		}
	});
});