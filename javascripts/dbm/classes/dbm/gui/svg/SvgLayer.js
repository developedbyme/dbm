/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.svg.SvgLayer", "dbm.gui.svg.SvgDisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.svg.SvgLayer");
	//"use strict";
	
	var SvgLayer = dbm.importClass("dbm.gui.svg.SvgLayer");
	
	var TransformSvgElementNode = dbm.importClass("dbm.flow.nodes.display.svg.TransformSvgElementNode");
	var ExternalCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalCssVariableProperty");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.svg.SvgLayer::_init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._graphics = new Array();
		
		this._stroke = this.addProperty("stroke", ExternalCssVariableProperty.createWithoutExternalObject());
		this._updateFunctions.getObject("display").addInputConnection(this._stroke);
		this._fill = this.addProperty("fill", ExternalCssVariableProperty.createWithoutExternalObject());
		this._updateFunctions.getObject("display").addInputConnection(this._fill);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		this._updateFunctions.getObject("display").addInputConnection(this._graphicsUpdate);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this.setElementAsTransformed();
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.addGraphics = function(aGraphics) {
		//console.log("dbm.gui.svg.SvgLayer::addGraphics");
		this._graphics.push(aGraphics);
		this.getElement().appendChild(aGraphics.getElement());
		
		this._graphicsUpdate.connectInput(aGraphics.getProperty("display"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._treeStructureItem = null;
		
		this._graphics = null;
		this._stroke = null;
		this._fill = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		//console.log("dbm.gui.svg.SvgLayer::createOnParent (static)");
		//console.log(aName, aParentOrDocument, aAddToParent, aAttributes);
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(theDocument);
		
		newNode.setElement(svgCreator.createNode("g", aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createNew = function(aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getMasterSvgCreator();
		
		newNode.setElement(svgCreator.createNode("g", aAttributes));
		
		return newNode;
	};
});