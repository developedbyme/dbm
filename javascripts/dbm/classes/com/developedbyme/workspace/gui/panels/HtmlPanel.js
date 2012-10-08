dbm.registerClass("com.developedbyme.workspace.gui.panels.HtmlPanel", "com.developedbyme.workspace.gui.panels.BasePanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var HtmlPanel = dbm.importClass("com.developedbyme.workspace.gui.panels.HtmlPanel");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.panels.HtmlPanel::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAttributes) {
		return ClassReference._create(ClassReference, aAttributes);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference._createOnParent(ClassReference, aParentOrDocument, aAddToParent, aAttributes);
	};
	
});