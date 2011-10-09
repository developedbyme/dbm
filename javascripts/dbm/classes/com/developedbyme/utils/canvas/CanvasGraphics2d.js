/**
 * A graphics in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasGraphics2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasGraphics2d");
	
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasGraphics2d::init");
		
		this.superCall();
		
		this._curves = new Array();
		this.moveWhenSwitchingCurves = false;
		this.fillStyle = null;
		this.strokeStyle = null;
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		
		var currentArray = this._curves;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			aContext.moveTo();
			for(var i = 0; i < currentArrayLength; i++) {

			}
		}
		
	};
	
	staticFunctions.create = function() {
		var newCanvasGraphics2d = (new ClassReference()).init();
		
		return newCanvasGraphics2d;
	};
});