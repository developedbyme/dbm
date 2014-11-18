/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode");
	
	//Self reference
	var CreateWedgeInBoxCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode");
	
	//Error report
	
	//Dependencies
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Utils
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode::_init");
		
		this.superCall();
		
		this._lineIntersection = (new LineIntersection2d()).init();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._pivotX = this.createProperty("pivotX", 0.5);
		this._pivotY = this.createProperty("pivotY", 0.5);
		this._startAngle = this.createProperty("startAngle", 0);
		this._endAngle = this.createProperty("endAngle", 0);
		this._width = this.createProperty("width", 1);
		this._height = this.createProperty("height", 1);
		this._outputCurve = this.createProperty("outputCurve", null).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._pivotX, this._pivotY, this._startAngle, this._endAngle, this._width, this._height], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode::_update");
		//console.log(this);
		
		var x = this._x.getValueWithoutFlow();
		var y = this._y.getValueWithoutFlow();
		var pivotX = this._pivotX.getValueWithoutFlow();
		var pivotY = this._pivotY.getValueWithoutFlow();
		var width = this._width.getValueWithoutFlow();
		var height = this._height.getValueWithoutFlow();
		
		var startAngle = this._startAngle.getValueWithoutFlow();
		var endAngle = this._endAngle.getValueWithoutFlow();
		
		var centerPointX = x+pivotX*width;
		var centerPointY = y+pivotY*height;
		
		var returnCurve = dbm.singletons.dbmCurveCreator.createRectangle(x, y, width, height);
		
		var centerPoint = Point.create(centerPointX, centerPointY);
		
		var startVector = Point.create(Math.cos(startAngle), Math.sin(startAngle));
		var endVector = Point.create(Math.cos(endAngle), Math.sin(endAngle));
		var tempVector2 = Point.create(0, 0);
		
		var startIndex = -1;
		var endIndex = -1;
		var startEdgePoint = Point.create();
		var endEdgePoint = Point.create();
		
		var currentArray = returnCurve.pointsArray;
		var currentArrayLength = currentArray.length-1;
		for(var i = 0; i < currentArrayLength; i++) { //MENOTE: last point is same as first point
			var currentPoint = currentArray[i];
			var nextPoint = currentArray[i+1];
			tempVector2.x = nextPoint.x-currentPoint.x;
			tempVector2.y = nextPoint.y-currentPoint.y;
			
			if(startIndex === -1) {
				var theResult = this._lineIntersection.findLineIntersection(centerPoint, startVector, currentPoint, tempVector2);
			
				if(theResult && this._lineIntersection.parameter2 >= 0 && this._lineIntersection.parameter2 <= 1 && this._lineIntersection.parameter1 >= 0) {
					startIndex = i;
					startEdgePoint.x = this._lineIntersection.x;
					startEdgePoint.y = this._lineIntersection.y;
				}
			}
			if(endIndex === -1) {
				var theResult = this._lineIntersection.findLineIntersection(centerPoint, endVector, currentPoint, tempVector2);
			
				if(theResult && this._lineIntersection.parameter2 >= 0 && this._lineIntersection.parameter2 <= 1 && this._lineIntersection.parameter1 >= 0) {
					endIndex = i;
					endEdgePoint.x = this._lineIntersection.x;
					endEdgePoint.y = this._lineIntersection.y;
				}
			}
		}
		
		var newPointsArray = new Array();
		newPointsArray.push(centerPoint);
		newPointsArray.push(startEdgePoint);
		if(startAngle > endAngle) {
			if(startIndex < endIndex) {
				startIndex += 4;
			}
			var currentArray = returnCurve.pointsArray;
			for(var i = startIndex; i > endIndex; i--) {
				newPointsArray.push(currentArray[i%4]);
			}
		}
		else if(startAngle < endAngle) {
			if(startIndex > endIndex) {
				endIndex += 4;
			}
			var currentArray = returnCurve.pointsArray;
			for(var i = startIndex+1; i <= endIndex; i++) {
				newPointsArray.push(currentArray[i%4]);
			}
		}
		
		newPointsArray.push(endEdgePoint);
		newPointsArray.push(centerPoint.duplicate());
		
		returnCurve.pointsArray = newPointsArray;
		
		this._outputCurve.setValueWithFlow(returnCurve, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._pivotX = null;
		this._pivotY = null;
		this._startAngle = null;
		this._endAngle = null;
		this._width = null;
		this._height = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aPivotX, aPivotY, aStartAngle, aEndAngle, aWidth, aHeight) {
		//console.log("com.developedbyme.flow.nodes.curves.CreateWedgeInBoxCurveNode::create");
		//console.log(aInputPoints, aIsRound);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("pivotX", aPivotY);
		newNode.setPropertyInputWithoutNull("pivotY", aPivotY);
		newNode.setPropertyInputWithoutNull("startAngle", aStartAngle);
		newNode.setPropertyInputWithoutNull("endAngle", aEndAngle);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	};
});