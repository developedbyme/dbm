/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.parts.curves.EditableCurvePart", "dbm.workspace.gui.parts.BaseWorkspacePart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.parts.curves.EditableCurvePart");
	//"use strict";
	
	var EditableCurvePart = dbm.importClass("dbm.workspace.gui.parts.curves.EditableCurvePart");
	
	var CurveDrawer2d = dbm.importClass("dbm.utils.canvas.CurveDrawer2d");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.parts.curves.EditableCurvePart::_init");
		
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