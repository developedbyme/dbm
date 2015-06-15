/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand");
	
	var BindVertexAttribPointerCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("dbm.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var WebglDataTypes = dbm.importClass("dbm.constants.webgl.WebglDataTypes");
	var WebglBeginModeTypes = dbm.importClass("dbm.constants.webgl.WebglBeginModeTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand::_init");
		
		this.superCall();
		
		this._buffer = this.createProperty("buffer", null);
		this._bufferType = this.createProperty("bufferType", null);
		this._shaderVariable = this.createProperty("shaderVariable", null);
		this._itemSize = this.createProperty("itemSize", 0);
		this._dataType = this.createProperty("dataType", WebglDataTypes.FLOAT);
		
		this._norm = this.createProperty("norm", false);
		this._stride = this.createProperty("stride", 0);
		this._offset = this.createProperty("offset", 0);
		
		this._graphicsUpdate.connectInput(this._buffer);
		this._graphicsUpdate.connectInput(this._bufferType);
		this._graphicsUpdate.connectInput(this._shaderVariable);
		this._graphicsUpdate.connectInput(this._itemSize);
		this._graphicsUpdate.connectInput(this._dataType);
		this._graphicsUpdate.connectInput(this._norm);
		this._graphicsUpdate.connectInput(this._stride);
		this._graphicsUpdate.connectInput(this._offset);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("dbm.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand::draw");
		
		//console.log("aContext.bindBuffer(" + this._bufferType.getValue() + ", " + this._buffer.getValue() + ");");
		//console.log("aContext.vertexAttribPointer(" + this._shaderVariable.getValue() + ", " + this._itemSize.getValue() + ", " + this._dataType.getValue() + ", " + this._norm.getValue() + ", " + this._stride.getValue() + ", " + this._offset.getValue() + ");");
		
		aContext.bindBuffer(this._bufferType.getValue(), this._buffer.getValue());
		aContext.enableVertexAttribArray(this._shaderVariable.getValue());
		aContext.vertexAttribPointer(this._shaderVariable.getValue(), this._itemSize.getValue(), this._dataType.getValue(), this._norm.getValue(), this._stride.getValue(), this._offset.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._buffer = null;
		this._bufferType = null;
		this._shaderVariable = null;
		this._itemSize = null;
		this._dataType = null;
		
		this._norm = null;
		this._stride = null;
		this._offset = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aBufferType, aBuffer, aShaderVariable, aItemSize, aDataType, aNorm, aStride, aOffset) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.setPropertyInputWithoutNull("bufferType", aBufferType);
		newCommand.setPropertyInputWithoutNull("buffer", aBuffer);
		newCommand.setPropertyInputWithoutNull("shaderVariable", aShaderVariable);
		newCommand.setPropertyInputWithoutNull("itemSize", aItemSize);
		newCommand.setPropertyInputWithoutNull("dataType", aDataType);
		newCommand.setPropertyInputWithoutNull("norm", aNorm);
		newCommand.setPropertyInputWithoutNull("stride", aStride);
		newCommand.setPropertyInputWithoutNull("offset", aOffset);
		
		return newCommand;
	};
});