/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.canvas.3d.drawcommands.RenderGroup", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.3d.drawcommands.RenderGroup");
	
	var RenderGroup = dbm.importClass("dbm.utils.canvas.3d.drawcommands.RenderGroup");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.3d.drawcommands.RenderGroup::_init");
		
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