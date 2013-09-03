dbm.registerClass("com.developedbyme.utils.math.geometry.RectangleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.geometry.RectangleFunctions");
	
	var RectangleFunctions = dbm.importClass("com.developedbyme.utils.math.geometry.RectangleFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var FitTypes = dbm.importClass("com.developedbyme.constants.FitTypes");
	
	staticFunctions._tempPoint = null;
	
	staticFunctions.getPointOnRectangleEdge = function(aRectangle, aParameter, aReturnPoint) {
		var side = Math.floor(aParameter*4);
		var localParameter = 4*aParameter-side;
		var localSide = side%4;
		if(localSide === 0) {
			aReturnPoint.x = aRectangle.x+localParameter*aRectangle.width;
			aReturnPoint.y = aRectangle.y;
		}
		else if(localSide === 1) {
			aReturnPoint.x = aRectangle.x+aRectangle.width;
			aReturnPoint.y = aRectangle.y+localParameter*aRectangle.height;
		}
		else if(localSide === 2) {
			aReturnPoint.x = aRectangle.x+(1-localParameter)*aRectangle.width;
			aReturnPoint.y = aRectangle.y*aRectangle.height;
		}
		else {
			aReturnPoint.x = aRectangle.x;
			aReturnPoint.y = aRectangle.y+(1-localParameter)*aRectangle.height;
		}
	};
	
	staticFunctions.getPointOnRectangle = function(aRectangle, aParameterX, aParameterY, aReturnPoint) {
		aReturnPoint.x = aRectangle.x+aParameterX*aRectangle.width;
		aReturnPoint.y = aRectangle.y+aParameterY*aRectangle.height;
	};
	
	staticFunctions.getPositionedRectanglePosition = function(aOuterRectangle, aInnerRectangle, aOuterParameterX, aOuterParameterY, aInnerParameterX, aInnerParameterY, aOffsetParameterX, aOffsetParameterY, aReturnPoint) {
		aReturnPoint.x = (aOuterRectangle.x+aOuterParameterX*aOuterRectangle.width)-(aInnerParameterX*aInnerRectangle.width)+aOffsetParameterX;
		aReturnPoint.y = (aOuterRectangle.y+aOuterParameterY*aOuterRectangle.height)-(aInnerParameterY*aInnerRectangle.height)+aOffsetParameterY;
	};
	
	staticFunctions.getScaledRectangle = function(aOuterRectangle, aParameterX, aParameterY, aOffsetParameterX, aOffsetParameterY, aReturnRectangle) {
		aReturnRectangle.width = aParameterX*aOuterRectangle.width+aOffsetParameterX;
		aReturnRectangle.height = aParameterY*aOuterRectangle.height+aOffsetParameterY;
	};
	
	staticFunctions.getBlendedRectangle = function(aOuterRectangle, aInnerRectangle, aParameterX, aParameterY, aReturnRectangle) {
		aReturnRectangle.x = aInnerRectangle.x+aParameterX*(aOuterRectangle.x-aInnerRectangle.x);
		aReturnRectangle.y = aInnerRectangle.y+aParameterY*(aOuterRectangle.y-aInnerRectangle.y);
		aReturnRectangle.width = aInnerRectangle.width+aParameterX*(aOuterRectangle.width-aInnerRectangle.width);
		aReturnRectangle.height = aInnerRectangle.height+aParameterY*(aOuterRectangle.height-aInnerRectangle.height);
	};
	
	staticFunctions.fitRectangle = function(aType, aOuterRectangle, aInnerRectangle, aReturnRectangle) {
		
		switch(aType) {
			case FitTypes.NONE:
				aReturnRectangle.x = aInnerRectangle.x;
				aReturnRectangle.y = aInnerRectangle.y;
				aReturnRectangle.width = aInnerRectangle.width;
				aReturnRectangle.height = aInnerRectangle.height;
				break;
			case FitTypes.STRETCH:
				aReturnRectangle.x = aOuterRectangle.x;
				aReturnRectangle.y = aOuterRectangle.y;
				aReturnRectangle.width = aOuterRectangle.width;
				aReturnRectangle.height = aOuterRectangle.height;
				break;
			case FitTypes.FILL:
				var newScale = Math.max(aOuterRectangle.width/aInnerRectangle.width, aOuterRectangle.height/aInnerRectangle.height);
				ClassReference.getScaledRectangle(aOuterRectangle, newScale, newScale, 0, 0, aReturnRectangle);
				var tempPoint = ClassReference.getTempPoint();
				ClassReference.getPositionedRectanglePosition(aOuterRectangle, aReturnRectangle, 0.5, 0.5, 0.5, 0.5, 0, 0, tempPoint);
				aReturnRectangle.x = tempPoint.x;
				aReturnRectangle.y = tempPoint.y;
				break;
			case FitTypes.LETTER_BOX:
				var newScale = Math.min(aOuterRectangle.width/aInnerRectangle.width, aOuterRectangle.height/aInnerRectangle.height);
				ClassReference.getScaledRectangle(aOuterRectangle, newScale, newScale, 0, 0, aReturnRectangle);
				var tempPoint = ClassReference.getTempPoint();
				ClassReference.getPositionedRectanglePosition(aOuterRectangle, aReturnRectangle, 0.5, 0.5, 0.5, 0.5, 0, 0, tempPoint);
				aReturnRectangle.x = tempPoint.x;
				aReturnRectangle.y = tempPoint.y;
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "fitRectangle", "Unknown type " + aType + ".");
				break;
		}
	};
	
	staticFunctions.getRectangleFromPoints = function(aTopLeftPoint, aBottomRightPoint, aReturnRectangle) {
		aReturnRectangle.x = aTopLeftPoint.x;
		aReturnRectangle.y = aTopLeftPoint.y;
		aReturnRectangle.width = aBottomRightPoint.x-aTopLeftPoint.x;
		aReturnRectangle.height = aBottomRightPoint.y-aTopLeftPoint.y;
	};
	
	staticFunctions.getTempPoint = function() {
		if(ClassReference._tempPoint === null) {
			ClassReference._tempPoint = Point.create();
		}
		return ClassReference._tempPoint;
	};
});