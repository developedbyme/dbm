/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.css.MediaQueryIsActiveNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.css.MediaQueryIsActiveNode");
	//"use strict";
	
	var MediaQueryIsActiveNode = dbm.importClass("dbm.flow.nodes.css.MediaQueryIsActiveNode");
	
	var FunctionFunctions = dbm.importClass("dbm.utils.native.function.FunctionFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.css.MediaQueryIsActiveNode::_init");
		
		this.superCall();
		
		this._window = this.createProperty("window", window);
		this._mediaQuery = this.createProperty("mediaQuery", null);
		this._mediaQueryList = this.createProperty("mediaQueryList", null);
		this._isActive = this.createProperty("isActive", false);
		
		this._callback_mediaQueryChangedState = FunctionFunctions.getCallbackFunction1Argument(this, this._mediaQueryChangedState);
		
		this.createUpdateFunction("default", this._update, [this._window, this._mediaQuery], [this._mediaQueryList]);
		this.createUpdateFunction("updateIsActive", this._updateIsActive, [this._mediaQueryList], [this._isActive]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.css.MediaQueryIsActiveNode::_update");
		
		var theWindow = this._window.getValueWithoutFlow();
		var mediaQuery = this._mediaQuery.getValueWithoutFlow();
		
		var currentMediaQueryList = this._mediaQueryList.getValueWithoutFlow();
		
		if(currentMediaQueryList !== null) {
			currentMediaQueryList.removeListener(this._callback_mediaQueryChangedState);
		}
		
		var mediaQueryList = theWindow.matchMedia(mediaQuery);
		
		mediaQueryList.addListener(this._callback_mediaQueryChangedState);
		
		this._mediaQueryList.setValueWithFlow(mediaQueryList, aFlowUpdateNumber);
	};
	
	objectFunctions._updateIsActive = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.css.MediaQueryIsActiveNode::_updateIsActive");
		
		var mediaQueryList = this._mediaQueryList.getValueWithoutFlow();
		
		this._isActive.setValueWithFlow(mediaQueryList.matches, aFlowUpdateNumber);
	};
	
	/**
	 * Callback when media query changes state.
	 */
	objectFunctions._mediaQueryChangedState = function(aMediaQueryList) {
		//console.log("dbm.flow.nodes.css.MediaQueryIsActiveNode::_mediaQueryChangedState");
		
		this._mediaQueryList.setAsDirty();
		
	}; //End function _mediaQueryChangedState
	
	objectFunctions.performDestroy = function() {
		
		if(this._mediaQueryList !== null) {
			var currentMediaQueryList = this._mediaQueryList.getValueWithoutFlow();
			
			if(currentMediaQueryList !== null) {
				currentMediaQueryList.removeListener(this._callback_mediaQueryChangedState);
			}
		}
		
		this.superCall();
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._window = null;
		this._mediaQuery = null;
		this._mediaQueryList = null;
		this._isActive = null;
		
		this._callback_mediaQueryChangedState = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aQuery, aWindow) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("mediaQuery", aQuery);
		newNode.setPropertyInputWithoutNull("window", aWindow);
		return newNode;
	};
});