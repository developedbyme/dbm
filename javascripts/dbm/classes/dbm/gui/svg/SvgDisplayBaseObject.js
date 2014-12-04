/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.svg.SvgDisplayBaseObject", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.svg.SvgDisplayBaseObject");
	//"use strict";
	
	var SvgDisplayBaseObject = dbm.importClass("dbm.gui.svg.SvgDisplayBaseObject");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var TransformSvgElementNode = dbm.importClass("dbm.flow.nodes.display.svg.TransformSvgElementNode");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.svg.SvgDisplayBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		return this;
	};
	
	objectFunctions.setElementAsPositioned = function() {
		
		//METODO: error message
		
		return this;
	};
	
	objectFunctions.setElementAsTransformed = function() {
		//console.log("dbm.gui.svg.SvgDisplayBaseObject::setElementAsTransformed");
		
		this._placementNode = TransformSvgElementNode.create(this._element);
		this._updateFunctions.getObject("display").addInputConnection(this._placementNode.getProperty("display"));
		this.addDestroyableObject(this._placementNode);
		
		return this;
	};
	
	objectFunctions.getSvgCreator = function() {
		//console.log("dbm.core.FlowBaseObject::getHtmlCreator");
		var element = this._element.getValue();
		var parentElement = this._parentElement.getValue();
		if(element !== null) {
			return dbm.singletons.dbmHtmlDomManager.getSvgCreator(DomReferenceFunctions.getDocument(element));
		}
		else if(parentElement !== null) {
			return dbm.singletons.dbmHtmlDomManager.getSvgCreator(DomReferenceFunctions.getDocument(parentElement));
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getSvgCreator", "Element or parent must be set before getting the svg creator.");
		return null;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
});