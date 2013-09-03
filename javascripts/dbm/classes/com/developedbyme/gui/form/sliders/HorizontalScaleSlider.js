dbm.registerClass("com.developedbyme.gui.form.sliders.HorizontalScaleSlider", "com.developedbyme.gui.form.sliders.AbstractSlider", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.form.sliders.HorizontalScaleSlider");
	
	var HorizontalScaleSlider = dbm.importClass("com.developedbyme.gui.form.sliders.HorizontalScaleSlider");
	
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	var PositionFunctions = dbm.importClass("com.developedbyme.utils.htmldom.PositionFunctions");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.form.sliders.HorizontalScaleSlider::_init");
		
		this.superCall();
		
		this._scalingElement = null;
		this._globalPositionPoint = Point.create();
		this.addDestroyableObject(this._globalPositionPoint);
		
		return this;
	};
	
	objectFunctions.setScalingElement = function(aElement) {
		this._scalingElement = aElement;
		
		return this;
	};
	
	objectFunctions._setupLinkedEvents = function(aElement) {
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.MOUSE_DOWN, ButtonExtendedEventIds.PRESS, ClassReference._SCRUB_ENABLED, true);
		this.getExtendedEvent().linkJavascriptEvent(aElement.ownerDocument, JavascriptEventIds.MOUSE_UP, ButtonExtendedEventIds.RELEASE, ClassReference._SCRUBBING, true);
	};
	
	objectFunctions.activate = function() {
		this.superCall();
		
		if(this._canScrub) {
			this.setStyleProperty("cursor", "pointer");
		}
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this.superCall();
		
		if(this._canScrub) {
			this.removeStyleProperty("cursor");
		}
		
		return this;
	};
	
	objectFunctions._getCurrentScrubValue = function() {
		//console.log("com.developedbyme.gui.form.sliders.HorizontalScaleSlider::_getCurrentScrubValue");
		var minValue = this._minValue.getValue();
		var maxValue = this._maxValue.getValue();
		
		var x = this._mousePositionNode.getProperty("x").getValue();
		var maxX = this.getElement().clientWidth;
		
		PositionFunctions.getGlobalPositionForNode(this.getElement(), this._globalPositionPoint);
		
		x -= this._globalPositionPoint.x;
		
		var scrubValue = (maxValue-minValue)*(x/maxX)+minValue;
		
		//console.log(scrubValue, x, maxX);
		return this._clampCurrentScrubValue(scrubValue, minValue, maxValue);
	};
	
	objectFunctions._updateDisplayFlow = function(aFlowUpdateNumber) {
		
		this.superCall(aFlowUpdateNumber);
		
		var outputValue = this._outputValue.getValueWithoutFlow();
		var minValue = this._minValue.getValueWithoutFlow();
		var maxValue = this._maxValue.getValueWithoutFlow();
		
		if(outputValue < minValue) {
			//METODO: request new range
		}
		else if(outputValue > maxValue) {
			//METODO: request new range
		}
		
		var parameter = Math.max(0, Math.min(1, (outputValue-minValue)/(maxValue-minValue)));
		//console.log((100*parameter)+"%");
		//console.log(this._display);
		this._scalingElement.style.setProperty("width", (100*parameter)+"%", "");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._scalingElement = null;
		this._globalPositionPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aScalingElement) {
		return (new ClassReference()).init().setElement(aElement).setScalingElement(aScalingElement);
	};
	
	staticFunctions.createSimple2ColorSlider = function(aParentOrDocument, aAddToParent, aWidth, aHeight, aForegroundColor, aBackgroundColor) {
		
		var newSlider = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		var backgroundElement = htmlCreator.createNode("div", {"style": "position: absolute; left 0px; top: 0px; background-color: #" + NumberFunctions.getPaddedNumber(aBackgroundColor.toString(16), 6) + "; width: 100%; height: 100%;"});
		var foregroundElement = htmlCreator.createNode("div", {"style": "position: absolute; left 0px; top: 0px; background-color: #" + NumberFunctions.getPaddedNumber(aForegroundColor.toString(16), 6) + "; width: 0%; height: 100%;"});
		
		var contentElement = htmlCreator.createNode("div", {"style": "position: relative; width: 100%; height: 100%;"}, backgroundElement, foregroundElement);
		
		newSlider.setElement(htmlCreator.createNode("div", {}, contentElement));
		newSlider.setStyleProperty("width", aWidth + "px");
		newSlider.setStyleProperty("height", aHeight + "px");
		newSlider.setStyleProperty("overflow", "hidden");
		newSlider.setStyleProperty("position", "relative");
		
		newSlider.setParent(theParent);
		if(aAddToParent !== false) {
			newSlider.addToDom();
		}
		
		//newSlider.setPropertyInput("maxValue", aWidth);
		newSlider.setScalingElement(foregroundElement);
		
		return newSlider;
	};
});