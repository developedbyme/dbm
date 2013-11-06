dbm.registerClass("com.developedbyme.utils.xml.XmlCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.xml.XmlCreator");
	//"use strict";
	
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.createXmlLoader = (function() {
		var returnLoader;
		
		if (window.XMLHttpRequest) {
			//console.log("standard");
			returnLoader = new XMLHttpRequest();
		}
		else {// for IE 5/6
			//console.log("ie");
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
			//returnDocument = xmlLoader.responseXML; //MENOTE: ie9 doesn't like this
			returnDocument = ClassReference.createXmlFromString(xmlLoader.responseText);
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
			//console.log(xmlLoader);
			//returnDocument = xmlLoader.responseXML; //MENOTE: ie9 doesn't like this
			returnDocument = ClassReference.createXmlFromString(xmlLoader.responseText);
		}
		catch(theError) {
			ErrorManager.getInstance().reportError("[XmlCreator]", "loadXmlFileWithPost", theError);
			return null;
		}
		
		return returnDocument;
	});
	
	staticFunctions.createEmptyXml = (function() {
		var returnDocument;
		if (window.DOMParser) {
			//console.log("standard");
			var parser = new DOMParser();
			returnDocument = parser.parseFromString("<temp />", "text/xml");
			returnDocument.removeChild(returnDocument.firstChild);
		}
		else {// Internet Explorer
			//console.log("ie");
			returnDocument = new ActiveXObject("Microsoft.XMLDOM");
			returnDocument.async = "false";
			returnDocument.loadXML("<temp />");
			returnDocument.removeChild(returnDocument.firstChild);
		} 
		
		return returnDocument;
	});
	
	staticFunctions.createXmlFromString = function(aText) {
		var returnDocument;
		if (window.DOMParser) {
			//console.log("standard");
			var parser = new DOMParser();
			returnDocument = parser.parseFromString(aText, "text/xml");
		}
		else {// Internet Explorer
			//console.log("ie");
			returnDocument = new ActiveXObject("Microsoft.XMLDOM");
			returnDocument.async = "false";
			returnDocument.loadXML(aText);
		} 
		
		return returnDocument;
	};
	
	staticFunctions.createStringFromXml = function(aNode){
		if(window.XMLSerializer) {
			//console.log("standard");
			var serializer = new XMLSerializer();
			return serializer.serializeToString(aNode);
		}
		else {
			//console.log("ie");
			return aNode.xml;
		}
	};
});