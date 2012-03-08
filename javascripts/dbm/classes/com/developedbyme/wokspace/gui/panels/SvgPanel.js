dbm.registerClass("com.developedbyme.workspace.gui.panels.SvgPanel", "com.developedbyme.workspace.gui.panels.BasePanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var SvgPanel = dbm.importClass("com.developedbyme.workspace.gui.panels.SvgPanel");
	
	var SvgView = dbm.importClass("com.developedbyme.gui.svg.SvgView");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.panels.SvgPanel::_init");
		
		this.superCall();
		
		this._view = SvgView.createNew();
		this.addDestroyableObject(this._view);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._view = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		return newNode;
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});