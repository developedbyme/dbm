dbm.registerClass("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand", "com.developedbyme.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand");
	
	var DrawArraysCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand");
	
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
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand::init");
		
		this.superCall();
		
		this._drawBufferLength = this.createProperty("drawBufferLength", 0);
		this._drawBufferOffset = this.createProperty("drawBufferOffset", 0);
		this._drawBufferBeginMode = this.createProperty("drawBufferBeginMode", WebglBeginModeTypes.TRIANGLES);
		
		this._graphicsUpdate.connectInput(this._drawBufferLength);
		this._graphicsUpdate.connectInput(this._drawBufferOffset);
		this._graphicsUpdate.connectInput(this._drawBufferBeginMode);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		aContext.drawArray(this._drawBufferBeginMode.getValue(), this._drawBufferOffset.getValue(), this._drawBufferDataType.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._drawBufferLength = null;
		this._drawBufferOffset = null;
		this._drawBufferBeginMode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCommand = (new ClassReference()).init();
		
		return newCommand;
	};
});