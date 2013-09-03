dbm.registerClass("com.developedbyme.gui.svg.SvgPath", "com.developedbyme.gui.svg.SvgDisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var SvgPath = dbm.importClass("com.developedbyme.gui.svg.SvgPath");
	
	var TransformSvgElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.svg.TransformSvgElementNode");
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
	var SvgPathFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgPathFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.svg.SvgPath::_init");
		
		this.superCall();
		
		this._stroke = this.addProperty("stroke", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty));
		this._updateFunctions.getObject("display").addInputConnection(this._stroke);
		this._fill = this.addProperty("fill", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty));
		this._updateFunctions.getObject("display").addInputConnection(this._fill);
		
		this._curve = this.createProperty("curve");
		this._drawUpdate = this.createGhostProperty("drawUpdate");
		this._updateFunctions.getObject("display").addInputConnection(this._drawUpdate);
		this.createUpdateFunction("drawUpdate", this._updateDrawFlow, [this._element, this._curve], [this._drawUpdate]);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._fill.setupExternalObject(this._element.getValue(), "fill", null, "none");
		this._stroke.setupExternalObject(this._element.getValue(), "stroke", null, "none");
		
		return this;
	};
	
	objectFunctions._updateDrawFlow = function(aFlowUpdateNumber) {
		var element = this._element.getValueWithoutFlow();
		if(element !== null) {
			element.pathSegList.clear();
			SvgPathFunctions.drawCurveToPath(element, this._curve.getValueWithoutFlow())
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._stroke = null;
		this._fill = null;
		
		this._curve = null;
		this._drawUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(theDocument);
		
		newNode.setElement(svgCreator.createNode("path", aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createNew = function(aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getMasterSvgCreator();
		
		newNode.setElement(svgCreator.createNode("path", aAttributes));
		
		return newNode;
	};
});