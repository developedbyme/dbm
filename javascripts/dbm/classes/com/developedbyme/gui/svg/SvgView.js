dbm.registerClass("com.developedbyme.gui.svg.SvgView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var SvgView = dbm.importClass("com.developedbyme.gui.svg.SvgView");
	
	var SvgLayer = dbm.importClass("com.developedbyme.gui.svg.SvgLayer");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var SvgLengthFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgLengthFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.svg.SvgView::_init");
		
		this.superCall();
		
		this._hierarchy = null;
		this._defsElement = null;
		this._definitions = NamedArray.create(true);
		this.addDestroyableObject(this._definitions);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._updateFunctions.getObject("display").addInputConnection(this._graphicsUpdate);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._defsElement = this.getElement().querySelector("defs");
		
		this._hierarchy = TreeStructure.create();
		this._hierarchy.ownsData = true;
		var rootNode = this._hierarchy.getRoot();
		rootNode.ownsData = true;
		this.addDestroyableObject(this._hierarchy);
		var rootLayer = SvgLayer.createOnParent(this.getElement(), true);
		rootNode.data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(rootNode);
		this._graphicsUpdate.connectInput(rootLayer.getProperty("display"));
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions.getLayer = function(aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data === null) {
			var newLayer = SvgLayer.createOnParent(this.getElement(), true); //METODO: add to correct layer
			currentItem.data = newLayer;
			newLayer._linkRegistration_setTreeStructureItem(currentItem);
			this._graphicsUpdate.connectInput(newLayer.getProperty("display"));
		}
		return currentItem.data;
	};
	
	objectFunctions.createLinearGradient = function(aId, aX1, aY1, aX2, aY2, aGradientUnits, aSpreadMethod) {
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(this.getElement().ownerDocument);
		
		var newNode = svgCreator.createNode("linearGradient");
		
		SvgLengthFunctions.setAnimatedBaseValue(newNode.gradientUnits, VariableAliases.valueWithDefault(aGradientUnits, 0));
		SvgLengthFunctions.setAnimatedBaseValue(newNode.spreadMethod, VariableAliases.valueWithDefault(aSpreadMethod, 0));
		
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.x1,  aX1, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.y1,  aY1, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.x2,  aX2, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.y2,  aY2, UnitTypes.PERCENTAGE);
		
		this.addDefinitionNode(aId, newNode);
		
		return newNode;
	};
	
	objectFunctions.createRadialGradient = function(aId, aX, aY, aRadius, aFocalPointX, aFocalPointY, aGradientUnits, aSpreadMethod) {
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(this.getElement().ownerDocument);
		
		var newNode = svgCreator.createNode("radialGradient");
		
		SvgLengthFunctions.setAnimatedBaseValue(newNode.gradientUnits, VariableAliases.valueWithDefault(aGradientUnits, 0));
		SvgLengthFunctions.setAnimatedBaseValue(newNode.spreadMethod, VariableAliases.valueWithDefault(aSpreadMethod, 0));
		
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.cx,  aX, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.cy,  aY, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.r,  aRadius, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.fx,  aFocalPointX, UnitTypes.PERCENTAGE);
		SvgLengthFunctions.setAnimatedBaseValueWithUnit(newNode.fy,  aFocalPointY, UnitTypes.PERCENTAGE);
		
		this.addDefinitionNode(aId, newNode);
		
		return newNode;
	};
	
	objectFunctions.addDefinitionNode = function(aId, aNode) {
		
		aNode.id = aId;
		
		this._defsElement.appendChild(aNode);
		this._definitions.addObject(aId, aNode);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._defsElement = null;
		this._definitions = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(theDocument);
		
		newNode.setElement(svgCreator.createSvg(aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createNew = function(aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getMasterSvgCreator();
		
		newNode.setElement(svgCreator.createSvg(aAttributes));
		
		return newNode;
	};
});