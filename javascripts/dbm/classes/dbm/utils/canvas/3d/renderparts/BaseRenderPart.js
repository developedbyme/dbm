/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.BaseRenderPart", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.BaseRenderPart");
	
	var BaseRenderPart = dbm.importClass("dbm.utils.canvas.3d.drawcommands.BaseRenderPart");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.BaseRenderPart::_init");
		
		this.superCall();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		return this;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		this._performDraw(aContext, aProjectionMatrix, aTransformationMatrix);
	};
	
	objectFunctions._performDraw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._graphicsUpdate = null;
		
		this.superCall();
	};
});