/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.Transform3dSetupNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.Transform3dSetupNode");
	
	//Self reference
	var Transform3dSetupNode = dbm.importClass("dbm.flow.nodes.display.Transform3dSetupNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CssFunctions = dbm.importClass("dbm.utils.css.CssFunctions");
	var CssTransformFunctions = dbm.importClass("dbm.utils.css.CssTransformFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.Transform3dSetupNode::_init");
		
		this.superCall();
		
		this._perspective = this.createProperty("perspective", 1500);
		this._perspectiveString = this.createProperty("perspectiveString", null);
		this._transformStyle = this.createProperty("transformStyle", "preserve-3d");
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		
		this.createUpdateFunctionWithArguments("perspectiveString", CssTransformFunctions.generatePerspectiveString, [this._perspective], [this._perspectiveString]);
		this.createUpdateFunction("default", this._update, [this._perspectiveString, this._transformStyle, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.Transform3dSetupNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			
			var transformString = this._perspectiveString.getValueWithoutFlow();
			
			if(transformString !== null) {
				CssFunctions.setBrowserSpecificCssToElement(htmlElement, "transform", transformString);
			}
			
			var transformStyleValue = this._transformStyle.getValueWithoutFlow();
			CssFunctions.setBrowserSpecificCssToElement(htmlElement, "transform-style", transformStyleValue);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._perspective = null;
		this._perspectiveString = null;
		this._transformStyle = null;
		this._element = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aPerspective, aTransformStyle) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("perspective", aPerspective);
		newNode.setPropertyInputWithoutNull("transformStyle", aTransformStyle);
		return newNode;
	};
});