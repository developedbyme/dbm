/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of calcualting arc length of a bezier curve.
 */
dbm.registerClass("dbm.projects.tests.math.curves.ArcLengthOfCurveApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ArcLengthOfCurveApplication = dbm.importClass("dbm.projects.tests.math.curves.ArcLengthOfCurveApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CreateArcLengthCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateArcLengthCurveNode");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var ParameterFromValueNode = dbm.importClass("dbm.flow.nodes.curves.ParameterFromValueNode");
	var GetPointOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetPointOnCurveNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	
	//Utils
	var VectorFunctions = dbm.importClass("dbm.utils.math.VectorFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tests.math.curves.ArcLengthOfCurveApplication::_init");
		
		this.superCall();
		
		this._curve = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tests.math.curves.ArcLengthOfCurveApplication::_createPage");
		
		this._curve = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(3, true, "624,338; 1119.66665649414,460; 1463.25682067871,857.208445549011; 1546,842; 1726.67001342773,817.767171859741; 1120.45909118652,246.749328613281; 1120.45909118652,246.749328613281; 1120.45909118652,246.749328613281; 335.585571289062,469.172775268555; 335.585571289062,469.172775268555;");
		
		var arcLengthCurveNode = CreateArcLengthCurveNode.create(this._curve, 0, this._curve.getMaxParameter());
		
		var arcLengthCurve = arcLengthCurveNode.getProperty("outputCurve").getValue();
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(1000);
		canvasView.getProperty("height").setValue(1000);
		
		var canvasController = canvasView.getController();
		
		var displayLayer = canvasController.getLayer("/display");
		displayLayer.getProperty("scaleX").setValue(0.5);
		displayLayer.getProperty("scaleY").setValue(0.5);
		
		var curveLayer = canvasController.getLayer("/display/curve");
		curveLayer.setStrokeStyle(0, "#0000FF");
		var curveDrawer = curveLayer.drawCurve(this._curve);
		
		var dataLayer = canvasController.getLayer("/data");
		dataLayer.getProperty("scaleX").setValue(300);
		dataLayer.getProperty("scaleY").setValue(0.3);
		
		var arcLengthLayer = canvasController.getLayer("/data/arcLength");
		arcLengthLayer.setStrokeStyle(0, "#00FF00");
		var arcLengthDrawer = arcLengthLayer.drawCurve(arcLengthCurve);
		
		var arcLengthMax = arcLengthCurveNode.getProperty("outputCurve").getValue().getMaxParameter();
		var curveMax = this._curve.getMaxParameter();
		
		var distanceEvaluationNode = ParameterFromValueNode.create(arcLengthCurveNode.getProperty("outputCurve"), 0, "y", 0.001, 0, arcLengthMax);
		var parameterConversionNode = MultiplicationNode.create(distanceEvaluationNode.getProperty("outputParameter"), (curveMax/arcLengthMax));
		var outputPointNode = GetPointOnCurveNode.create(this._curve, parameterConversionNode.getProperty("outputValue"));
		
		//var lastX = NaN;
		//var lastY = NaN;
		
		var numberOfPositions = 100;
		for(var i = 0; i <= numberOfPositions; i++) {
			distanceEvaluationNode.getProperty("inputValue").setValue(3013.249565413881*i/numberOfPositions); //METODO: set max dynamically
			
			var newLayer = canvasController.getLayer("/display/position_" + i);
			newLayer.setStrokeStyle(0, "#FF0000");
			newLayer.moveTo(0, -10);
			newLayer.lineTo(0, 10);
			newLayer.moveTo(-10, 0);
			newLayer.lineTo(10, 0);
			
			var currentX = outputPointNode.getProperty("outputValueX").getValue();
			var currentY = outputPointNode.getProperty("outputValueY").getValue();
			
			newLayer.getProperty("x").setValue(currentX);
			newLayer.getProperty("y").setValue(currentY);
			
			//console.log(VectorFunctions.lengthFromVectorValues3d(currentX-lastX, currentY-lastY, 0));
			
			//lastX = currentX;
			//lastY = currentY;
		}
		
		canvasController.getProperty("display").update();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});