/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A mask in a 2d canvas.
 */
dbm.registerClass("dbm.utils.canvas.CanvasMask2d", "dbm.utils.canvas.CanvasGraphics2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.CanvasMask2d");
	
	var CanvasMask2d = dbm.importClass("dbm.utils.canvas.CanvasMask2d");
	
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.CanvasMask2d::_init");
		
		this.superCall();
		
		this._tempPoint = Point.create();
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		//console.log("dbm.utils.canvas.CanvasMask2d::draw");
		//console.log(this, this._curves);
		
		var currentArray = this._curves;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			var tempPoint = this._tempPoint;
			currentArray[0].getStartPoint(tempPoint);
			aContext.moveTo(tempPoint.x, tempPoint.y);
			aContext.beginPath();
			aContext.lineWidth = 0;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentCurve = currentArray[i];
				currentCurve.getStartPoint(tempPoint);
				aContext.lineTo(tempPoint.x, tempPoint.y);
				currentCurve.draw(aContext);
			}
			aContext.closePath();
			aContext.clip();
		}
		
	};
	
	staticFunctions.create = function() {
		var newCanvasMask2d = (new ClassReference()).init();
		
		return newCanvasMask2d;
	};
});