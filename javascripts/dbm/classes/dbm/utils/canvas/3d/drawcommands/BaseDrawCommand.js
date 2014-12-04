/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.BaseDrawCommand", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.BaseDrawCommand");
	
	var BaseDrawCommand = dbm.importClass("dbm.utils.canvas.3d.drawcommands.BaseDrawCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("dbm.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.BaseDrawCommand::_init");
		
		this.superCall();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//MENOTE: should be overridden
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._graphicsUpdate = null;
		
		this.superCall();
	};
});