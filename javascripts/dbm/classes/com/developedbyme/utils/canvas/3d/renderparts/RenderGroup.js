dbm.registerClass("com.developedbyme.utils.canvas.3d.drawcommands.RenderGroup", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.drawcommands.RenderGroup");
	
	var RenderGroup = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.RenderGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.drawcommands.RenderGroup::_init");
		
		this.superCall();
		
		this._renderParts = new Array();
		
		return this;
	};
	
	objectFunctions.addPart = function(aPart) {
		this._graphicsUpdate.connectInput(aPart.getProperty("graphicsUpdate"));
		this._renderParts.push(aPart);
	};
	
	objectFunctions._performDraw = function(aContext, aProjectionMatrix, aTransformationMatrix) {
		var currentArray = this._renderParts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			currentPart.draw(aContext, aProjectionMatrix, aTransformationMatrix);
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._renderParts = null;
		
		this.superCall();
	};
});