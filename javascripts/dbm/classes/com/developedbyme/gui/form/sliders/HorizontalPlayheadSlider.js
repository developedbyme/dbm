/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider", "com.developedbyme.gui.form.sliders.AbstractSlider", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider");
	
	//Self reference
	var HorizontalPlayheadSlider = dbm.importClass("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider");
	
	//Error report
	
	//Dependencies
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	var PositionFunctions = dbm.importClass("com.developedbyme.utils.htmldom.PositionFunctions");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider::_init");
		
		this.superCall();
		
		this._playheadElement = null;
		this._globalPositionPoint = Point.create();
		this.addDestroyableObject(this._globalPositionPoint);
		
		this._playheadWidth = this.createProperty("playheadWidth", 0);
		this._updateFunctions.getObject("display").addInputConnection(this._playheadWidth);
		
		return this;
	};
	
	objectFunctions.setPlayheadElement = function(aElement) {
		this._playheadElement = aElement;
		
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
		//console.log("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider::_getCurrentScrubValue");
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
		//console.log("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider::_updateDisplayFlow");
		
		this.superCall(aFlowUpdateNumber);
		
		var outputValue = this._outputValue.getValueWithoutFlow();
		var minValue = this._minValue.getValueWithoutFlow();
		var maxValue = this._maxValue.getValueWithoutFlow();
		var playheadWidth = this._playheadWidth.getValueWithoutFlow();
		var fullWidth = this.getElement().clientWidth;
		
		//console.log(outputValue, minValue, maxValue, playheadWidth, fullWidth);
		
		if(outputValue < minValue) {
			//METODO: request new range
		}
		else if(outputValue > maxValue) {
			//METODO: request new range
		}
		
		var parameter = Math.max(0, Math.min(1, (outputValue-minValue)/(maxValue-minValue)));
		//console.log((100*parameter)+"%");
		//console.log(this._display);
		this._playheadElement.style.setProperty("left", (parameter*(fullWidth-playheadWidth))+"px", "");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._playheadElement = null;
		this._globalPositionPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aPlayheadElement, aPlayheadWidth) {
		var newSlider = (new ClassReference()).init().setElement(aElement).setPlayheadElement(aPlayheadElement);
		newSlider.setPropertyInputWithoutNull("playheadWidth", aPlayheadWidth);
		return newSlider;
	};
	
	staticFunctions.createSimple2ColorSlider = function(aParentOrDocument, aAddToParent, aWidth, aHeight, aPlayheadWidth, aForegroundColor, aBackgroundColor) {
		
		var newSlider = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		var backgroundElement = htmlCreator.createNode("div", {"style": "position: absolute; left 0px; top: 0px; background-color: #" + NumberFunctions.getPaddedNumber(aBackgroundColor.toString(16), 6) + "; width: 100%; height: 100%;"});
		var foregroundElement = htmlCreator.createNode("div", {"style": "position: absolute; left 0px; top: 0px; background-color: #" + NumberFunctions.getPaddedNumber(aForegroundColor.toString(16), 6) + "; width: " + aPlayheadWidth + "px; height: 100%;"});
		
		var contentElement = htmlCreator.createNode("div", {"style": "position: relative; width: 100%; height: 100%;"}, backgroundElement, foregroundElement);
		
		newSlider.setPropertyInputWithoutNull("playheadWidth", aPlayheadWidth);
		
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
		newSlider.setPlayheadElement(foregroundElement);
		
		return newSlider;
	};
});