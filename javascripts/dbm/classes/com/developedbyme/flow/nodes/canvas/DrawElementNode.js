/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.canvas.DrawElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.DrawElementNode");
	
	//Self reference
	var DrawElementNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.DrawElementNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constants
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawElementNode::_init");
		
		this.superCall();
		
		var element = this.createProperty("element", null);
		var canvas = this.createProperty("canvas", null);
		var update = this.createProperty("update", null);
		var dataType = this.createProperty("dataType", "image/jpeg");
		var quality = this.createProperty("quality", 1);
		var dataUrl = this.createProperty("dataUrl", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference.renderElement, [element, canvas, dataType, quality, update], [dataUrl]);
		
		return this;
	};
	
	staticFunctions.create = function(aElement, aCanvas, aDataType, aQuality, aUpdate) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("canvas", aCanvas);
		newNode.setPropertyInputWithoutNull("dataType", aDataType);
		newNode.setPropertyInputWithoutNull("quality", aQuality);
		newNode.setPropertyInputWithoutNull("update", aUpdate);
		return newNode;
	};
	
	staticFunctions.renderElement = function(aElement, aCanvas, aDataType, aQuality, aUpdate) {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawElementNode::renderElement");
		
		var context = aCanvas.getContext("2d");
		context.drawImage(aElement, 0, 0);
		
		return aCanvas.toDataURL(aDataType, aQuality);
	};
});