dbm.registerClass("com.developedbyme.utils.canvas.3d.drawcommands.UseShaderProgramCommand", "com.developedbyme.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.drawcommands.UseShaderProgramCommand");
	
	var UseShaderProgramCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.UseShaderProgramCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.UseShaderProgramCommand::init");
		
		this.superCall();
		
		this._shader = this.createProperty("shader", null);
		
		this._graphicsUpdate.connectInput(this._shader);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		aContext.useProgram(this._shader.getValue());
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shader = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aShader) {
		var newCommand = (new ClassReference()).init();
		
		newCommand.setPropertyInputWithoutNull("shader", aShader);
		
		return newCommand;
	};
});

