dbm.registerClass("com.developedbyme.workspace.gui.panels.SvgPanel", "com.developedbyme.workspace.gui.panels.BasePanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var SvgPanel = dbm.importClass("com.developedbyme.workspace.gui.panels.SvgPanel");
	
	var SvgView = dbm.importClass("com.developedbyme.gui.svg.SvgView");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
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
		return ClassReference._create(ClassReference, aAttributes);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference._createOnParent(ClassReference, aParentOrDocument, aAddToParent, aAttributes);
	};
	
});