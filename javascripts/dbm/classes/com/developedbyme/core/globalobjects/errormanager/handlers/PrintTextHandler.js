dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	var PrintTextHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler::init");
		
		this.superCall();
		
		this.htmlElement = null;
		
		return this;
	};
	
	objectFunctions.report = function(aType, aLevel, aObject, aFunctionName, aData) {
		var className;
		switch(aType) {
			case ReportTypes.ERROR:
				className = "dbmReportErrorField";
				break;
			case ReportTypes.WARNING:
				className = "dbmReportWarningField";
				break;
			case ReportTypes.LOG:
				className = "dbmReportLogField";
				break;
			default:
				className = "dbmReportUnknownField";
				break;
		}
		
		var htmlString = "<div class=\"dbmReportField " + className + "\"><span class=\"dbmReportType\">" + aType + "</span><span class=\"dbmReportLevel\">" + aLevel + "</span><span class=\"dbmReportObject\">" + aObject + "</span><span class=\"dbmReportFunction\">" + aFunctionName + "</span><span class=\"dbmReportData\">" + aData + "</span></div>";
		this.htmlElement.innerHTML += htmlString;
	};
	
	objectFunctions.reportError = function(aObject, aFunctionName, aError) {
		var htmlString = "<div class=\"dbmReportField dbmReportErrorField\"><span class=\"dbmReportType\">error</span><span class=\"dbmReportObject\">" + aObject + "</span><span class=\"dbmReportFunction\">" + aFunctionName + "</span><span class=\"dbmReportError\">" + aError + "</span></div>";
		this.htmlElement.innerHTML += htmlString;
	};
	
	staticFunctions.create = function(aHtmlElement) {
		var newHandler = (new ClassReference()).init();
		newHandler.htmlElement = aHtmlElement;
		return newHandler;
	};
	
	staticFunctions.createWithDiv = function(aParentOrDocument) {
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		var newDiv = htmlCreator.createNode("div", {"class": "dbmReport"});
		theParent.appendChild(newDiv);
		
		var newHandler = ClassReference.create(newDiv);
		return newHandler;
	};
});