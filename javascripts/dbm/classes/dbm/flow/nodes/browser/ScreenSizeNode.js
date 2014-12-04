/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.browser.ScreenSizeNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.browser.ScreenSizeNode");
	
	var ScreenSizeNode = dbm.importClass("dbm.flow.nodes.browser.ScreenSizeNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.browser.ScreenSizeNode::_init");
		
		this.superCall();
		
		var theScreen = window.screen;
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._availWidth = this.createProperty("availWidth", 0);
		this._availHeight = this.createProperty("availHeight", 0);
		this._availLeft = this.createProperty("availLeft", 0);
		this._availTop = this.createProperty("availTop", 0);
		this._screen = this.createProperty("screen", theScreen);
		
		this.createUpdateFunction("default", this._update, [this._screen], [this._width, this._height, this._availWidth, this._availHeight, this._availLeft, this._availTop]);
		
		this.getExtendedEvent().createEvent("resize");
		this.getExtendedEvent().addCommandToEvent("resize", CallFunctionCommand.createCommand(this, this._updateSize, []));
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("dbm.flow.nodes.browser.ScreenSizeNode::start");
		
		//METODO
		this.getExtendedEvent().linkJavascriptEvent(this._window.getValue(), "resize", "resize", "resize", true, true).activate();
	};
	
	objectFunctions.stop = function() {
		
		//METODO
		this.getExtendedEvent().deactivateJavascriptLink("resize");
	};
	
	objectFunctions._updateSize = function() {
		//console.log("dbm.flow.nodes.browser.ScreenSizeNode::_updateSize");
		//console.log(aEvent);
		
		this._screen.setAsDirty();
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.browser.ScreenSizeNode::_update");
		
		var theScreen = this._screen.getValueWithoutFlow();
		
		//MENOTE: everything taht has to do with the screen might be slow. Properties should only be requested once.
		this._width.setValueWithFlow(theScreen.width, aFlowUpdateNumber);
		this._height.setValueWithFlow(theScreen.height, aFlowUpdateNumber);
		this._availWidth.setValueWithFlow(theScreen.availWidth, aFlowUpdateNumber);
		this._availHeight.setValueWithFlow(theScreen.availHeight, aFlowUpdateNumber);
		var availLeft = theScreen.availLeft;
		if(availLeft !== undefined) {
			this._availLeft.setValueWithFlow(availLeft, aFlowUpdateNumber);
		}
		var availTop = theScreen.availTop;
		if(availTop !== undefined) {
			this._availTop.setValueWithFlow(availTop, aFlowUpdateNumber);
		}
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});