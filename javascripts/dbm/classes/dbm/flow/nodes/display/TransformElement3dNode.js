/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.TransformElement3dNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.TransformElement3dNode");
	
	//Self reference
	var TransformElement3dNode = dbm.importClass("dbm.flow.nodes.display.TransformElement3dNode");
	
	//Error report
	
	//Dependencies
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	
	//Utils
	var CssFunctions = dbm.importClass("dbm.utils.css.CssFunctions");
	var CssTransformFunctions = dbm.importClass("dbm.utils.css.CssTransformFunctions");
	
	//Constants
	var RotationOrderTypes = dbm.importClass("dbm.constants.graphics.RotationOrderTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.TransformElement3dNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._z = this.createProperty("z", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._scaleZ = this.createProperty("scaleZ", 1);
		this._rotateX = this.createProperty("rotateX", 0);
		this._rotateY = this.createProperty("rotateY", 0);
		this._rotateZ = this.createProperty("rotateZ", 0);
		this._pivotX = this.createProperty("pivotX", 0.5);
		this._pivotY = this.createProperty("pivotY", 0.5);
		this._rotationOrder = this.createProperty("rotationOrder", RotationOrderTypes.XYZ);
		this._transformString = this.createProperty("transformString", null);
		
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		this._sizeOfElementNode = this.addDestroyableObject(SizeOfElementNode.create(this._element));
		
		this._elementWidth = this.createProperty("elementWidth", this._sizeOfElementNode.getProperty("width"));
		this._elementHeight = this.createProperty("elementHeight", this._sizeOfElementNode.getProperty("height"));
		
		var pivotOffsetXMultiplierNode = this.addDestroyableObject(MultiplicationNode.create(this._pivotX, this._elementWidth));
		var pivotOffsetYMultiplierNode = this.addDestroyableObject(MultiplicationNode.create(this._pivotY, this._elementHeight));
		
		var offsetedXNode = this.addDestroyableObject(SubtractionNode.create(this._x, pivotOffsetXMultiplierNode.getProperty("outputValue")));
		var offsetedYNode = this.addDestroyableObject(SubtractionNode.create(this._y, pivotOffsetYMultiplierNode.getProperty("outputValue")));
		
		this.createUpdateFunctionWithArguments("transformString", CssTransformFunctions.generateFullTransformString, [offsetedXNode.getProperty("outputValue"), offsetedYNode.getProperty("outputValue"), this._z, this._scaleX, this._scaleY, this._scaleZ, this._rotateX, this._rotateY, this._rotateZ, this._rotationOrder], [this._transformString]);
		
		this.createUpdateFunction("default", this._update, [this._transformString, this._pivotX, this._pivotY, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.TransformElement3dNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			
			var transformString = this._transformString.getValueWithoutFlow();
			
			var transformationOriginString = (100*this._pivotX.getValueWithoutFlow()) + "% " + (100*this._pivotY.getValueWithoutFlow()) + "%";
			
			//console.log(transformString, transformationOriginString);
			
			CssFunctions.setBrowserSpecificCssToElement(htmlElement, "transform", transformString);
			
			CssFunctions.setBrowserSpecificCssToElement(htmlElement, "transform-origin", transformationOriginString);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._z = null;
		this._scaleX = null;
		this._scaleY = null;
		this._scaleZ = null;
		this._rotateX = null;
		this._rotateY = null;
		this._rotateZ = null;
		this._element = null;
		this._display = null;
		this._pivotX = null;
		this._pivotY = null;
		this._rotationOrder = null;
		this._transformString = null;
		this._sizeOfElementNode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aX, aY, aZ, aScaleX, aScaleY, aScaleZ, aRotateX, aRotateY, aRotateZ, aPivotX, aPivotY, aRotationOrder) {
		//console.log("dbm.flow.nodes.display.TransformElement3dNode::create");
		//console.log(aElement, aX, aY, aZ, aScaleX, aScaleY, aScaleZ, aRotateX, aRotateY, aRotateZ, aPivotX, aPivotY, aRotationOrder);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		newNode.setPropertyInputWithoutNull("scaleZ", aScaleZ);
		newNode.setPropertyInputWithoutNull("rotateX", aRotateX);
		newNode.setPropertyInputWithoutNull("rotateY", aRotateY);
		newNode.setPropertyInputWithoutNull("rotateZ", aRotateZ);
		newNode.setPropertyInputWithoutNull("pivotX", aPivotX);
		newNode.setPropertyInputWithoutNull("pivotY", aPivotY);
		newNode.setPropertyInputWithoutNull("rotationOrder", aRotationOrder);
		return newNode;
	};
});