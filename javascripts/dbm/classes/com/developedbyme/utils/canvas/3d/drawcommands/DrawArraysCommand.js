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
		
		this._bufferLength = this.createProperty("bufferLength", 0);
		this._bufferOffset = this.createProperty("bufferOffset", 0);
		this._beginMode = this.createProperty("beginMode", WebglBeginModeTypes.TRIANGLES);
		
		this._graphicsUpdate.connectInput(this._bufferLength);
		this._graphicsUpdate.connectInput(this._bufferOffset);
		this._graphicsUpdate.connectInput(this._beginMode);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand::draw");
		
		//console.log("aContext.drawArrays(" + this._beginMode.getValue() + ", " + this._bufferOffset.getValue() + ", " + this._bufferLength.getValue() + ");");
		
		aContext.drawArrays(this._beginMode.getValue(), this._bufferOffset.getValue(), this._bufferLength.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._bufferLength = null;
		this._bufferOffset = null;
		this._beginMode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aBeginMode, aOffset, aLength) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.setPropertyInputWithoutNull("beginMode", aBeginMode);
		newCommand.setPropertyInputWithoutNull("bufferLength", aLength);
		newCommand.setPropertyInputWithoutNull("bufferOffset", aOffset);
		
		return newCommand;
	};
});