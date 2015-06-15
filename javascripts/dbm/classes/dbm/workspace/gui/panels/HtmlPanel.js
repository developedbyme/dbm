/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.panels.HtmlPanel", "dbm.workspace.gui.panels.BasePanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	var HtmlPanel = dbm.importClass("dbm.workspace.gui.panels.HtmlPanel");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.panels.HtmlPanel::_init");
		
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