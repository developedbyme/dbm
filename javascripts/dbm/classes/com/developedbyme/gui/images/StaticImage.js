dbm.registerClass("com.developedbyme.gui.images.StaticImage", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var StaticImage = dbm.importClass("com.developedbyme.gui.images.StaticImage");
	
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.images.StaticImage::init");
		
		this.superCall();
		
		this._source = this.addProperty("source", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty));
		this._updateFunctions.getObject("display").addInputConnection(this._source);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._source.setupExternalObject(this._htmlElement, "src");
		
		return this;
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrl, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createImage(aUrl, aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});