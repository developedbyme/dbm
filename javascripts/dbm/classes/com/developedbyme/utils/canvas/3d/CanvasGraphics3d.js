dbm.registerClass("com.developedbyme.utils.canvas.3d.CanvasGraphics3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.CanvasGraphics3d");
	
	var CanvasGraphics3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasGraphics3d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasGraphics3d::_init");
		
		this.superCall();
		
		this._commands = new Array();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		return this;
	};
	
	objectFunctions.addDrawCommand = function(aCommand) {
		
		this._commands.push(aCommand);
		
		return aCommand;
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasGraphics3d::draw");
		
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