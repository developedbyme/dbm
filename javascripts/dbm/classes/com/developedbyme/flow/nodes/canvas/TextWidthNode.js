/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.canvas.TextWidthNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.TextWidthNode");
	
	var TextWidthNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.TextWidthNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.TextWidthNode::_init");
		
		this.superCall();
		
		this._canvas = this.createProperty("canvas", dbm.singletons.dbmHtmlDomManager.getTempCanvas());
		this._text = this.createProperty("text", null);
		this._font = this.createProperty("font", null);
		this._width = this.createProperty("width", null);
		
		this.createUpdateFunction("default", this._update, [this._text, this._font, this._canvas], [this._width]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.TextWidthNode::_update");
		
		var canvasContext = this._canvas.getValueWithoutFlow().getContext("2d");
		
		canvasContext.font = this._font.getValueWithoutFlow();
		var textWidth = canvasContext.measureText(this._text.getValueWithoutFlow()).width;
		
		if(textWidth === 0) {
			console.log("++++++");
			return;
		}
		
		this._width.setValueWithFlow(textWidth, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._canvas = null;
		this._text = null;
		this._width = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aText, aFont, aCanvas) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("text", aText);
		newNode.setPropertyInputWithoutNull("font", aFont);
		newNode.setPropertyInputWithoutNull("canvas", aCanvas);
		return newNode;
	};
});