dbm.registerClass("com.developedbyme.utils.canvas.3d.TextureShader", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.TextureShader");
	
	var TextureShader = dbm.importClass("com.developedbyme.utils.canvas.3d.TextureShader");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.TextureShader::init");
		
		this.superCall();
		
		this._shaderProgram = null;
		this._texture = null;
		
		this._shaderPointId = null;
		this._shaderUvPointId = null;
		this._textureSamplerId = null;
		
		this._projectionMatrixId = null;
		this._transformationMatrixId = null;
		
		return this;
	};
	
	objectFunctions.setupRendering = function(aShaderProgram, aTexture) {
		this._shaderProgram = aShaderProgram;
		this._texture = aTexture;
		
		return this;
	};
	
	objectFunctions.setupPointNames = function(aShaderPointId, aShaderUvPointId, aTextureSamplerId) {
		
		this._shaderPointId = aShaderPointId;
		this._shaderUvPointId = aShaderUvPointId;
		this._textureSamplerId = aTextureSamplerId;
		
		return this;
	};
	
	objectFunctions.setupMatrixNames = function(aProjectionMatrixId, aTransformationMatrixId) {
		
		this._projectionMatrixId = aProjectionMatrixId;
		this._transformationMatrixId = aTransformationMatrixId;
		
		return this;
	};
	
	objectFunctions.setupPoints = function(aContext, aBufferId) {
		aContext.bindBuffer(aContext.ARRAY_BUFFER, aBufferId);
		aContext.vertexAttribPointer(this._shaderPointId, 3, aContext.FLOAT, false, 0, 0);
	};
	
	objectFunctions.setupUvPoints = function(aContext, aBufferId) {
		aContext.bindBuffer(aContext.ARRAY_BUFFER, aBufferId);
		aContext.vertexAttribPointer(this._shaderUvPointId, 2, aContext.FLOAT, false, 0, 0);
	};
	
	objectFunctions.setupTexture = function(aContext) {
		aContext.activeTexture(aContext.TEXTURE0);
		aContext.bindTexture(aContext.TEXTURE_2D, this._texture);
		aContext.uniform1i(this._textureSamplerId, aContext.TEXTURE0);
	};
	
	objectFunctions.setupMatrices = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		aContext.uniformMatrix4fv(this._projectionMatrixId, false, aProjectionMatrix);
		aContext.uniformMatrix4fv(this._transformationMatrixId, false, aTransformationMatrix);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shaderProgram = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aShaderProgram, aTexture, aShaderPointId, aShaderUvPointId, aTextureSamplerId, aProjectionMatrixId, aTransformationMatrixId) {
		
		aShaderPointId = VariablesAliases.valueWithDefault(aShaderPointId, "vertexPosition");
		aShaderUvPointId = VariablesAliases.valueWithDefault(aShaderUvPointId, "uvPosition");
		aTextureSamplerId = VariablesAliases.valueWithDefault(aTextureSamplerId, "textureSampler");
		aProjectionMatrixId = VariablesAliases.valueWithDefault(aProjectionMatrixId, "projectionMatrix");
		aTransformationMatrixId = VariablesAliases.valueWithDefault(aTransformationMatrixId, "transformationMatrix");
		
		var newTextureShader = (new ClassReference()).init();
		newTextureShader.setupRendering(aShaderProgram, aTexture);
		newTextureShader.setupPointNames(aShaderPointId, aShaderUvPointId, aTextureSamplerId);
		newTextureShader.setupMatrixNames(aProjectionMatrixId, aTransformationMatrixId);
		return newTextureShader;
	};
});