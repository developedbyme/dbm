dbm.registerClass("com.developedbyme.flow.nodes.display.TransformElement3dNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.TransformElement3dNode");
	
	var TransformElement3dNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElement3dNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.TransformElement3dNode::_init");
		
		this.superCall();
		
		this._perspective = this.createProperty("perspective", 1500);
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
		this._pivotZ = this.createProperty("pivotZ", 0.5);
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("default", this._update, [this._perspective, this._x, this._y, this._z, this._scaleX, this._scaleY, this._scaleZ, this._rotateX, this._rotateY, this._rotateZ, this._pivotX, this._pivotY, this._pivotZ, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.TransformElement3dNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			
			var htmlElementWidthOffset;
			var htmlElementHeightOffset;
			
			if(htmlElement.clientWidth === 0 && !isNaN(htmlElement.width) && htmlElement.width !== 0) {
				htmlElementWidthOffset = -1*this._pivotX.getValueWithoutFlow()*htmlElement.width;
				htmlElementHeightOffset = -1*this._pivotY.getValueWithoutFlow()*htmlElement.height;
			}
			else {
				htmlElementWidthOffset = -1*this._pivotX.getValueWithoutFlow()*htmlElement.clientWidth;
				htmlElementHeightOffset = -1*this._pivotY.getValueWithoutFlow()*htmlElement.clientHeight;
			}
			
			var transformString = "perspective(" + this._perspective.getValueWithoutFlow() + "px) translateX(" + (this._x.getValueWithoutFlow()+htmlElementWidthOffset) + "px) translateY(" + (this._y.getValueWithoutFlow()+htmlElementHeightOffset) + "px) translateZ(" + (this._z.getValueWithoutFlow()) + "px) scaleX(" + this._scaleX.getValueWithoutFlow() + ") scaleY(" + this._scaleY.getValueWithoutFlow() + ") scaleZ(" + this._scaleZ.getValueWithoutFlow() + ") rotateX(" + (180*this._rotateX.getValueWithoutFlow()/Math.PI) + "deg) rotateY(" + (180*this._rotateY.getValueWithoutFlow()/Math.PI) + "deg) rotateZ(" + (180*this._rotateZ.getValueWithoutFlow()/Math.PI) + "deg)";
			var transformationOriginString = (100*this._pivotX.getValueWithoutFlow()) + "% " + (100*this._pivotY.getValueWithoutFlow()) + "%";
			
			//console.log(transformString, transformationOriginString);
			
			htmlElement.style.setProperty("-moz-transform", transformString, "");
			htmlElement.style.setProperty("-ms-transform", transformString, "");
			htmlElement.style.setProperty("-o-transform", transformString, "");
			htmlElement.style.setProperty("-webkit-transform", transformString, "");
			htmlElement.style.setProperty("transform", transformString, "");
			
			htmlElement.style.setProperty("-moz-transform-origin", transformationOriginString, "");
			htmlElement.style.setProperty("-ms-transform-origin", transformationOriginString, "");
			htmlElement.style.setProperty("-o-transform-origin", transformationOriginString, "");
			htmlElement.style.setProperty("-webkit-transform-origin", transformationOriginString, "");
			htmlElement.style.setProperty("transform-origin", transformationOriginString, "");
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._perspective = null;
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
		this._pivotZ = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aPerspective, aX, aY, aZ, aScaleX, aScaleY, aScaleZ, aRotateX, aRotateY, aRotateZ, aPivotX, aPivotY, aPivotZ) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("perspective", aPerspective);
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
		newNode.setPropertyInputWithoutNull("pivotZ", aPivotZ);
		return newNode;
	}
});