dbm.registerClass("com.developedbyme.gui.svg.SvgDisplayBaseObject", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.svg.SvgDisplayBaseObject");
	//"use strict";
	
	var SvgDisplayBaseObject = dbm.importClass("com.developedbyme.gui.svg.SvgDisplayBaseObject");
	
	var TransformSvgElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.svg.TransformSvgElementNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.svg.SvgDisplayBaseObject::_init");
		
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
		//console.log("com.developedbyme.gui.svg.SvgDisplayBaseObject::setElementAsTransformed");
		
		this._placementNode = TransformSvgElementNode.create(this._element);
		this._updateFunctions.getObject("display").addInputConnection(this._placementNode.getProperty("display"));
		this.addDestroyableObject(this._placementNode);
		
		return this;
	};
	
	objectFunctions.getSvgCreator = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::getHtmlCreator");
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