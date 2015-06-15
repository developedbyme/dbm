/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.UseShaderProgramCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.UseShaderProgramCommand");
	
	var UseShaderProgramCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.UseShaderProgramCommand");
	
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
		//console.log("dbm.utils.canvas.3d.drawcommands.UseShaderProgramCommand::_init");
		
		this.superCall();
		
		this._shader = this.createProperty("shader", null);
		
		this._graphicsUpdate.connectInput(this._shader);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("dbm.utils.canvas.3d.drawcommands.UseShaderProgramCommand::draw");
		
		//console.log("aContext.useProgram(" + this._shader.getValue() + ");");
		
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

