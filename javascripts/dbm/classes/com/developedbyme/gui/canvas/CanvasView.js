dbm.registerClass("com.developedbyme.gui.canvas.CanvasView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.canvas.CanvasView");
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.canvas.CanvasView::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("canvas", aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});