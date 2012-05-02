dbm.registerClass("com.developedbyme.utils.canvas.3d.drawcommands.DrawElementsCommand", "com.developedbyme.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.drawcommands.DrawElementsCommand");
	
	var DrawElementsCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.DrawElementsCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var WebglDataTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglDataTypes");
	var WebglBeginModeTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglBeginModeTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.DrawElementsCommand::init");
		
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