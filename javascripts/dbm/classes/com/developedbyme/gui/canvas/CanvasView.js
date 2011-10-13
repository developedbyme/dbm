dbm.registerClass("com.developedbyme.gui.canvas.CanvasView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.canvas.CanvasView");
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var CanvasController2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasController2d");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.canvas.CanvasView::init");
		
		this.superCall();
		
		this._controller = null;
		
		return this;
	};
	
	objectFunctions.setController = function(aController) {
		//console.log("com.developedbyme.gui.canvas.CanvasView::setController");
		
		this._controller = aController;
		this._controller.setPropertyInput("canvas", this._htmlElement);
		
		return this;
	};
	
	objectFunctions.getController = function() {
		//console.log("com.developedbyme.gui.canvas.CanvasView::getController");
		
		return this._controller;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._controller = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aContextType, aAttributes) {
		var newView = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newView.setElement(htmlCreator.createNode("canvas", aAttributes));
		switch(aContextType) {
			case "2d":
				newView.setController(CanvasController2d.create());
				break;
			default:
				//METODO: error message
				break;
		}
		newView.setParent(theParent);
		if(aAddToParent != false) {
			newView.addToDom();
		}
		
		return newView;
	};
});