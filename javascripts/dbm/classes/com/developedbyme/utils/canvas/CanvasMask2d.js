/**
 * A mask in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasMask2d", "com.developedbyme.utils.canvas.CanvasGraphics2d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasMask2d");
	
	var CanvasMask2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasMask2d");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasMask2d::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasMask2d::draw");
		//console.log(this, this._curves);
		
		var currentArray = this._curves;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			var tempPoint = Point.create();
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