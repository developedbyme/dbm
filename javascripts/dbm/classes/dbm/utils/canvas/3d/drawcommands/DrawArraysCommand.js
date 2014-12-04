/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.DrawArraysCommand", "dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.DrawArraysCommand");
	
	var DrawArraysCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.DrawArraysCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("dbm.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var WebglDataTypes = dbm.importClass("dbm.constants.webgl.WebglDataTypes");
	var WebglBeginModeTypes = dbm.importClass("dbm.constants.webgl.WebglBeginModeTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.DrawArraysCommand::_init");
		
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
		//console.log("dbm.utils.canvas.3d.drawcommands.DrawArraysCommand::draw");
		
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