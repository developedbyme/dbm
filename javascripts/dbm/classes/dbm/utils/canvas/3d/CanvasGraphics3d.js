/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.CanvasGraphics3d", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.CanvasGraphics3d");
	
	var CanvasGraphics3d = dbm.importClass("dbm.utils.canvas.3d.CanvasGraphics3d");
	
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
		//console.log("dbm.utils.canvas.3d.CanvasGraphics3d::_init");
		
		this.superCall();
		
		this._commands = new Array();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		return this;
	};
	
	objectFunctions.addDrawCommand = function(aCommand) {
		
		this._commands.push(aCommand);
		
		return aCommand;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("dbm.utils.canvas.3d.CanvasGraphics3d::draw");
		
		//METODO: covert to typed array
		var projectionMatrix = aProjectionMatrix;
		var transformationMatrix = aTransformationMatrix;
		
		var currentArray = this._commands;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCommand = currentArray[i];
			currentCommand.draw(aContext, projectionMatrix, transformationMatrix);
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._graphicsUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCanvasGraphics3d = (new ClassReference()).init();
		
		return newCanvasGraphics3d;
	};
});