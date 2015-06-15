/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.UseTextureCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.UseTextureCommand");
	
	var UseTextureCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.UseTextureCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("dbm.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var WebglTextureTargetTypes = dbm.importClass("dbm.constants.webgl.WebglTextureTargetTypes");
	var WebglTextureUnitTypes = dbm.importClass("dbm.constants.webgl.WebglTextureUnitTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.UseTextureCommand::_init");
		
		this.superCall();
		
		this._shaderVariable = this.createProperty("shaderVariable", null);
		this._textureUnit = this.createProperty("textureUnit", WebglTextureUnitTypes.TEXTURE0);
		this._texture = this.createProperty("texture", null);
		this._textureTarget = this.createProperty("textureTarget", WebglTextureTargetTypes.TEXTURE_2D);
		
		this._graphicsUpdate.connectInput(this._shaderVariable);
		this._graphicsUpdate.connectInput(this._textureUnit);
		this._graphicsUpdate.connectInput(this._texture);
		this._graphicsUpdate.connectInput(this._textureTarget);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		aContext.activeTexture(this._textureUnit.getValue());
		aContext.bindTexture(this._textureTarget.getValue(), this._texture.getValue());
		aContext.uniform1i(this._shaderVariable.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shaderVariable = null;
		this._textureUnit = null;
		this._texture = null;
		this._textureTarget = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aShaderVariable, aTexture, aTextureUnit, aTextureTarget) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.setPropertyInputWithoutNull("shaderVariable", aShaderVariable);
		newCommand.setPropertyInputWithoutNull("texture", aTexture);
		newCommand.setPropertyInputWithoutNull("textureUnit", aTextureUnit);
		newCommand.setPropertyInputWithoutNull("textureTarget", aTextureTarget);
		
		return newCommand;
	};
});

