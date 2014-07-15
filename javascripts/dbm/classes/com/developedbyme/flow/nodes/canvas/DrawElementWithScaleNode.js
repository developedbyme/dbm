/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.canvas.DrawElementWithScaleNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.DrawElementWithScaleNode");
	
	//Self reference
	var DrawElementWithScaleNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.DrawElementWithScaleNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constants
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawElementWithScaleNode::_init");
		
		this.superCall();
		
		var element = this.createProperty("element", null);
		var canvas = this.createProperty("canvas", null);
		var update = this.createProperty("update", null);
		var inputWidth = this.createProperty("inputWidth", 0);
		var inputHeight = this.createProperty("inputHeight", 0);
		var outputWidth = this.createProperty("outputWidth", 0);
		var outputHeight = this.createProperty("outputHeight", 0);
		var dataType = this.createProperty("dataType", "image/jpeg");
		var quality = this.createProperty("quality", 1);
		var dataUrl = this.createProperty("dataUrl", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference.renderElement, [element, inputWidth, inputHeight, canvas, outputWidth, outputHeight, dataType, quality, update], [dataUrl]);
		
		return this;
	};
	
	staticFunctions.create = function(aElement, aInputWidth, aInputHeight, aCanvas, aOutputWidth, aOutputHeight, aDataType, aQuality, aUpdate) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("inputWidth", aInputWidth);
		newNode.setPropertyInputWithoutNull("inputHeight", aInputHeight);
		newNode.setPropertyInputWithoutNull("canvas", aCanvas);
		newNode.setPropertyInputWithoutNull("outputWidth", aOutputWidth);
		newNode.setPropertyInputWithoutNull("outputHeight", aOutputHeight);
		newNode.setPropertyInputWithoutNull("dataType", aDataType);
		newNode.setPropertyInputWithoutNull("quality", aQuality);
		newNode.setPropertyInputWithoutNull("update", aUpdate);
		return newNode;
	};
	
	staticFunctions.renderElement = function(aElement, aInputWidth, aInputHeight, aCanvas, aOutputWidth, aOutputHeight, aDataType, aQuality, aUpdate) {
		//console.log("com.developedbyme.flow.nodes.canvas.DrawElementWithScaleNode::renderElement");
		
		var context = aCanvas.getContext("2d");
		context.drawImage(aElement, 0, 0, aInputWidth, aInputHeight, 0, 0, aOutputWidth, aOutputHeight);
		
		return aCanvas.toDataURL(aDataType, aQuality);
	};
});