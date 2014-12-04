/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.svg.TransformSvgElementNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.svg.TransformSvgElementNode");
	
	var TransformSvgElementNode = dbm.importClass("dbm.flow.nodes.display.svg.TransformSvgElementNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.svg.TransformSvgElementNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._rotate = this.createProperty("rotate", 0);
		this._pivotX = this.createProperty("pivotX", 0);
		this._pivotY = this.createProperty("pivotY", 0);
		this._element = this.createProperty("element", null);
		this._transform = this.createProperty("transform", null);
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._scaleX, this._scaleY, this._rotate, this._pivotX, this._pivotY, this._element], [this._transform, this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.svg.TransformSvgElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			
			var pivotX = this._pivotX.getValueWithoutFlow();
			var pivotY = this._pivotY.getValueWithoutFlow();
			
			var transform = this._transform.getValueWithoutFlow();
			if(transform === null) {
				transform = htmlElement.ownerSVGElement.createSVGTransform();
				this._transform.setValueWithFlow(transform, aFlowUpdateNumber);
				htmlElement.transform.baseVal.appendItem(transform);
			}
			
			var aValue = this._scaleX.getValueWithoutFlow();
			var dValue = this._scaleY.getValueWithoutFlow();
			var eValue = this._scaleX.getValueWithoutFlow()*-1*pivotX;
			var fValue = this._scaleY.getValueWithoutFlow()*-1*pivotY;
			
			var sinValue = Math.sin(this._rotate.getValueWithoutFlow());
			var cosValue = Math.cos(this._rotate.getValueWithoutFlow());
			
			transform.matrix.a = cosValue*aValue;
			transform.matrix.c = -1*sinValue*dValue;
			transform.matrix.b = sinValue*aValue;
			transform.matrix.d = cosValue*dValue;
			transform.matrix.e = cosValue*eValue-sinValue*fValue;
			transform.matrix.f = sinValue*eValue+cosValue*fValue;
			
			transform.matrix.e += pivotX+this._x.getValueWithoutFlow();
			transform.matrix.f += pivotY+this._y.getValueWithoutFlow();
			
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._scaleX = null;
		this._scaleY = null;
		this._rotate = null;
		this._element = null;
		this._transform = null;
		this._display = null;
		this._pivotX = null;
		this._pivotY = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aX, aY, aScaleX, aScaleY, aRotate, aPivotX, aPivotY) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		newNode.setPropertyInputWithoutNull("rotate", aRotate);
		newNode.setPropertyInputWithoutNull("pivotX", aPivotX);
		newNode.setPropertyInputWithoutNull("pivotY", aPivotY);
		return newNode;
	};
});
