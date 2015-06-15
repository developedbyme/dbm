/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.DrawElementsCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.DrawElementsCommand");
	
	var DrawElementsCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.DrawElementsCommand");
	
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
		//console.log("dbm.utils.canvas.3d.drawcommands.DrawElementsCommand::_init");
		
		this.superCall();
		
		this._drawBuffer = this.createProperty("drawBuffer", null);
		this._drawBufferLength = this.createProperty("drawBufferLength", 0);
		this._drawBufferOffset = this.createProperty("drawBufferOffset", 0);
		this._drawBufferBeginMode = this.createProperty("drawBufferBeginMode", WebglBeginModeTypes.TRIANGLES);
		this._drawBufferDataType = this.createProperty("drawBufferDataType", WebglDataTypes.UNSIGNED_SHORT);
		
		this._graphicsUpdate.connectInput(this._drawBuffer);
		this._graphicsUpdate.connectInput(this._drawBufferLength);
		this._graphicsUpdate.connectInput(this._drawBufferOffset);
		this._graphicsUpdate.connectInput(this._drawBufferBeginMode);
		this._graphicsUpdate.connectInput(this._drawBufferDataType);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		aContext.bindBuffer(aContext.ELEMENT_ARRAY_BUFFER, this._drawBuffer.getValue());
		aContext.drawElements(this._drawBufferBeginMode.getValue(), this._drawBufferDataType.getValue(), this._drawBufferDataType.getValue(), this._drawBufferOffset.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._drawBuffer = null;
		this._drawBufferLength = null;
		this._drawBufferOffset = null;
		this._drawBufferBeginMode = null;
		this._drawBufferDataType = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCommand = (new ClassReference()).init();
		
		return newCommand;
	};
});