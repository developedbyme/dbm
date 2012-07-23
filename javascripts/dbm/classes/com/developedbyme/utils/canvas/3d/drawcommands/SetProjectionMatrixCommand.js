dbm.registerClass("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand", "com.developedbyme.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand");
	
	var SetProjectionMatrixCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand::_init");
		
		this.superCall();
		
		this._shaderVariable = this.createProperty("shaderVariable", null);
		this._transpose = this.createProperty("transpose", false);
		
		this._graphicsUpdate.connectInput(this._shaderVariable);
		this._graphicsUpdate.connectInput(this._transpose);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand::draw");
		//console.log(aProjectionMatrix.toString());
		
		//console.log("aContext.uniformMatrix4fv(" + this._shaderVariable.getValue() + ", " + this._transpose.getValue() + ", " + new Float32Array(aProjectionMatrix.valuesArray) + ");");
		aContext.uniformMatrix4fv(this._shaderVariable.getValue(), this._transpose.getValue(), new Float32Array(aProjectionMatrix.valuesArray));
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shaderVariable = null;
		this._transpose = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aShaderVariable, aTranspose) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.setPropertyInputWithoutNull("shaderVariable", aShaderVariable);
		newCommand.setPropertyInputWithoutNull("transpose", aTranspose);
		
		return newCommand;
	};
});