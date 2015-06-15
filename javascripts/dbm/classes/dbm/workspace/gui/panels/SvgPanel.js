/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.panels.SvgPanel", "dbm.workspace.gui.panels.BasePanel", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	var SvgPanel = dbm.importClass("dbm.workspace.gui.panels.SvgPanel");
	
	var SvgView = dbm.importClass("dbm.gui.svg.SvgView");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.panels.SvgPanel::_init");
		
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