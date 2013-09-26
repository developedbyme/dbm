dbm.registerClass("com.developedbyme.workspace.gui.parts.curves.EditableCurvePart", "com.developedbyme.workspace.gui.parts.BaseWorkspacePart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.parts.curves.EditableCurvePart");
	//"use strict";
	
	var EditableCurvePart = dbm.importClass("com.developedbyme.workspace.gui.parts.curves.EditableCurvePart");
	
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.parts.curves.EditableCurvePart::_init");
		
		this.superCall();
		this._canvasLayer = null;
		this._curve = null;
		this._curveDrawer = null;
		this._visiblePoints = null;
		
		return this;
	};
	
	objectFunctions.setup = function(aCanvasLayer, aCurve) {
		this._canvasLayer = aCanvasLayer;
		this._canvasLayer.setStrokeStyle(0, "#FF0000");
		this._curve = aCurve;
		this._curveDrawer = this._canvasLayer.drawCurve(aCurve);
		
		return this;
	};
	
	objectFunctions.showPoint = function() {
		
	};
	
	objectFunctions.showAllPoints = function() {
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCanvasLayer, aCurve) {
		var newEditableCurvePart = (new ClassReference()).init();
		
		newEditableCurvePart.setup(aCanvasLayer, aCurve);
		
		return newEditableCurvePart;
		
	};
});