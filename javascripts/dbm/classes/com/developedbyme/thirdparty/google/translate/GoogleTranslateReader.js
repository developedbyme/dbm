dbm.registerClass("com.developedbyme.thirdparty.google.translate.GoogleTranslateReader", "com.developedbyme.utils.audio.AudioPlayer", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.thirdparty.google.translate.GoogleTranslateReader");
	
	var GoogleTranslateReader = dbm.importClass("com.developedbyme.thirdparty.google.translate.GoogleTranslateReader");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.thirdparty.google.translate.GoogleTranslateReader::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aPhrase, aPreload, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("audio", aAttributes));
		
		var encodedText = encodeURIComponent(aPhrase);
		var textLength = aPhrase.length;
		
		var url = "http://translate.google.com/translate_tts?ie=UTF-8&q=" + encodedText + "&tl=en&total=1&idx=0&textlen=" + textLength;
		
		newNode.setUrl(url, aPreload);
		newNode.setParent(theParent);
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});