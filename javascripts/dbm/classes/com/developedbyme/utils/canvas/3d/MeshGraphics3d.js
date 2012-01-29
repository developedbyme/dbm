/**
 * A graphics to draw a mesh.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.3d.MeshGraphics3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.MeshGraphics3d");
	
	var MeshGraphics3d = dbm.importClass("com.developedbyme.utils.canvas.3d.MeshGraphics3d");
	
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
		//console.log("com.developedbyme.utils.canvas.3d.MeshGraphics3d::init");
		
		this.superCall();
		
		this._mesh = this.createProperty("mesh", null);
		this._shader = this.createProperty("shader", null);
		
		this._pointsArray = this.createProperty("pointsArray", null);
		this._uvPointsArray = this.createProperty("uvPointsArray", null);
		this._drawCommands = this.createProperty("drawCommands", null);
		
		this._webGlArrays = this.createGhostProperty("webGlArrays");
		
		this.createUpdateFunction("webGlArrays", this._updateWebglArraysFlow, [this._mesh], [this._pointsArray, this._uvPointsArray, this._drawCommands, this._webGlArrays]);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._webGlArrays);
		
		return this;
	};
	
	objectFunctions._updateWebglArraysFlow = function(aFlowUpdateNumber) {
		
		var theMesh = this._mesh.getValueWithoutFlow(aFlowUpdateNumber);
		
		var floatArrayType = TypedArrayFunctions.getWebGlFloatArray();
		
		this._pointsArray.setValueWithFlow(new floatArrayType(theMesh.points), aFlowUpdateNumber);
		this._uvPointsArray.setValueWithFlow(new floatArrayType(theMesh.uvPoints), aFlowUpdateNumber);
		
		var drawCommands = theMesh.getDrawCommands();
	};
	
	objectFunctions.draw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		
		var theMesh = this._mesh.getValue();
		var currentShader = this._shader.getValue();
		
		currentShader.setupPoints(aContext, );
		
		currentShader.setupUvPoints(aContext, );
		
		currentShader.setupTexture(aContext, );
		
		currentShader.setupMatrices(aContext, aProjectionMatrix, aTransformationMatrix);
		
		var currentArray = this._drawCommands.getValue();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentDrawIndexCommand = currentArray[i];
			aContext.drawElements(currentDrawIndexCommand.drawType, theMesh.getNumberOfPoints(), aContext.UNSIGNED_SHORT, 0);
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mesh = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newMeshGraphics3d = (new ClassReference()).init();
		
		return newMeshGraphics3d;
	};
});