/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A graphics in a 2d canvas.
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasGraphics2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasGraphics2d");
	
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var LineCapTypes = dbm.importClass("com.developedbyme.constants.LineCapTypes");
	var LineJoinTypes = dbm.importClass("com.developedbyme.constants.LineJoinTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasGraphics2d::_init");
		
		this.superCall();
		
		this._curves = new Array();
		this.moveWhenSwitchingCurves = false;
		this.scaleStrokes = false;
		
		this._fillStyle = this.createProperty("fillStyle", null);
		this._lineWidth = this.createProperty("lineWidth", 1);
		this._lineCap = this.createProperty("lineCap", LineCapTypes.BUTT);
		this._lineJoin = this.createProperty("lineJoin", LineJoinTypes.MITER);
		this._miterLimit = this.createProperty("miterLimit", 10);
		this._strokeStyle = this.createProperty("strokeStyle", null);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._fillStyle);
		this._graphicsUpdate.connectInput(this._lineWidth);
		this._graphicsUpdate.connectInput(this._lineCap);
		this._graphicsUpdate.connectInput(this._lineJoin);
		this._graphicsUpdate.connectInput(this._miterLimit);
		this._graphicsUpdate.connectInput(this._strokeStyle);
		
		this.closePath = false;
		this._canDraw = true;
		this._strokeOverFill = true;
		
		return this;
	};
	
	objectFunctions.getStartPoint = function(aReturnPoint) {
		if(this._curves.length > 0) {
			this._curves[0].getStartPoint(aReturnPoint);
		}
		//METODO: error message
		return;
	};
	
	objectFunctions.getLastCurve = function() {
		if(this._curves.length > 0) {
			return this._curves[this._curves.length-1];
		}
		return null;
	};
	
	objectFunctions.hasCurves = function() {
		return this._curves.length > 0;
	};
	
	objectFunctions.canDraw = function() {
		return this._canDraw;
	};
	
	objectFunctions.addCurve = function(aCurve) {
		this._curves.push(aCurve);
		this._graphicsUpdate.connectInput(aCurve.getProperty("graphicsUpdate"));
	};
	
	objectFunctions._fillPath = function(aContext, aStyle) {
		if(aStyle !== null) {
			aContext.fillStyle = aStyle;
			aContext.fill();
		}
	};
	
	objectFunctions._strokePath = function(aContext, aStyle) {
		if(aStyle !== null) {
			aContext.strokeStyle = aStyle;
			if(!this.scaleStrokes) {
				aContext.save();
				aContext.setTransform(1, 0, 0, 1, 0, 0);
			}
			aContext.stroke();
			if(!this.scaleStrokes) {
				aContext.restore();
			}
		}
	};
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasGraphics2d::draw");
		//console.log(this, this._curves, this.strokeStyle);
		
		var currentArray = this._curves;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			var tempPoint = Point.create();
			currentArray[0].getStartPoint(tempPoint);
			aContext.moveTo(tempPoint.x, tempPoint.y);
			aContext.beginPath();
			aContext.lineWidth = this._lineWidth.getValue();
			aContext.lineCap = this._lineCap.getValue();
			aContext.lineJoin = this._lineJoin.getValue();
			aContext.miterLimit = this._miterLimit.getValue();
			for(var i = 0; i < currentArrayLength; i++) {
				var currentCurve = currentArray[i];
				currentCurve.getStartPoint(tempPoint);
				if(this.moveWhenSwitchingCurves) {
					aContext.moveTo(tempPoint.x, tempPoint.y);
				}
				else {
					aContext.lineTo(tempPoint.x, tempPoint.y);
				}
				currentCurve.draw(aContext);
			}
			if(this.closePath) {
				aContext.closePath();
			}
			if(this._strokeOverFill) {
				this._fillPath(aContext, this._fillStyle.getValue());
				this._strokePath(aContext, this._strokeStyle.getValue());
			}
			else {
				this._strokePath(aContext, this._strokeStyle.getValue());
				this._fillPath(aContext, this._fillStyle.getValue());
			}
		}
		
	};
	
	staticFunctions.create = function() {
		var newCanvasGraphics2d = (new ClassReference()).init();
		
		return newCanvasGraphics2d;
	};
});