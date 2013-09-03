dbm.registerClass("com.developedbyme.flow.nodes.display.TransformElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.TransformElementNode");
	
	var TransformElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElementNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.TransformElementNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._rotate = this.createProperty("rotate", 0);
		this._pivotX = this.createProperty("pivotX", 0.5);
		this._pivotY = this.createProperty("pivotY", 0.5);
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._scaleX, this._scaleY, this._rotate, this._pivotX, this._pivotY, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.TransformElementNode::_update");
		
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
			
			var transformString = "translateX(" + (this._x.getValueWithoutFlow()+htmlElementWidthOffset) + "px) translateY(" + (this._y.getValueWithoutFlow()+htmlElementHeightOffset) + "px) scaleX(" + this._scaleX.getValueWithoutFlow() + ") scaleY(" + this._scaleY.getValueWithoutFlow() + ") rotate(" + (180*this._rotate.getValueWithoutFlow()/Math.PI) + "deg)";
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
		
		this._x = null;
		this._y = null;
		this._scaleX = null;
		this._scaleY = null;
		this._rotate = null;
		this._element = null;
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
	}
});