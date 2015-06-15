/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand");
	
	var SetProjectionMatrixCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("dbm.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand::_init");
		
		this.superCall();
		
		this._shaderVariable = this.createProperty("shaderVariable", null);
		this._transpose = this.createProperty("transpose", false);
		
		this._graphicsUpdate.connectInput(this._shaderVariable);
		this._graphicsUpdate.connectInput(this._transpose);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("dbm.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand::draw");
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