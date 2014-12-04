/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.RenderModel3d", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.RenderModel3d");
	
	var RenderModel3d = dbm.importClass("dbm.utils.canvas.3d.drawcommands.RenderModel3d");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	var Matrix = dbm.importClass("dbm.core.data.matrices.Matrix");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.RenderModel3d::_init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		
		this._identityMatrix = Matrix.createIdentity(4, 4);
		
		this._model = this.createProperty("model", null);
		this._model.setAlwaysUpdateFlow(true);
		this._graphicsUpdate.connectInput(this._model);
		
		this._camera = this.createProperty("camera", null);
		this._camera.setAlwaysUpdateFlow(true);
		this._graphicsUpdate.connectInput(this._camera);
		
		return this;
	};
	
	objectFunctions._performDraw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		var model = this._model.getValue();
		var camera =  this._camera.getValue();
		
		var perspectiveMatrix = (camera !== null) ? camera.getProjectionMatrix() : this._identityMatrix;
		var transforamtionMatrix = (camera !== null) ? camera.getCameraTransformationMatrix() : this._identityMatrix;
		
		model.getRootLayer().draw(aContext, aProjectionMatrix, aTransformationMatrix, this._numberOfLinksToResolve);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});