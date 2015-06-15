/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.canvas.webgl.CreateBufferNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.canvas.webgl.CreateBufferNode");
	
	var CreateBufferNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateBufferNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var WebglDrawTypes = dbm.importClass("dbm.constants.webgl.WebglDrawTypes");
	var WebglBufferTypes = dbm.importClass("dbm.constants.webgl.WebglBufferTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateBufferNode::_init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._dataArray = this.createProperty("dataArray", null);
		this._dataArray.setAlwaysUpdateFlow(true);
		this._bufferType = this.createProperty("bufferType", WebglBufferTypes.ARRAY_BUFFER);
		this._drawType = this.createProperty("drawType", WebglDrawTypes.STATIC_DRAW);
		this._buffer = this.createProperty("buffer", null);
		
		this.createUpdateFunction("default", this._update, [this._context, this._dataArray, this._bufferType, this._drawType], [this._buffer]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateBufferNode::_update");
		
		var currentContext = this._context.getValueWithoutFlow();
		
		var currentBuffer = this._buffer.getValueWithoutFlow();
		if(currentBuffer !== null) {
			//METODO: this might not be the case
			currentContext.deleteBuffer(currentBuffer);
		}
		
		var buffer = currentContext.createBuffer();
		currentContext.bindBuffer(this._bufferType.getValueWithoutFlow(), buffer);
		currentContext.bufferData(this._bufferType.getValueWithoutFlow(), this._dataArray.getValueWithoutFlow(), this._drawType.getValueWithoutFlow());
		
		this._buffer.setValueWithFlow(buffer, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._dataArray = null;
		this._bufferType = null;
		this._drawType = null;
		this._buffer = null;
		
		this.superCall();
	};

		staticFunctions.create = function(aContext, aDataArray, aBufferType, aDrawType) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("drawArray", aDataArray);
		newNode.setPropertyInputWithoutNull("bufferType", aBufferType);
		newNode.setPropertyInputWithoutNull("drawType", aDrawType);
		return newNode;
	};
});