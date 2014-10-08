/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Pixel effect that performs a mesh deformation.
 */
dbm.registerClass("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect", "com.developedbyme.utils.canvas.pixeleffects.PixelEffectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect");
	
	//Self reference
	var MeshDeformationEffect = dbm.importClass("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect");
	
	//Error report
	
	//Dependnecies
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::_init");
		
		this.superCall();
		
		this._mesh = this.createProperty("mesh", null);
		this._inputX = this.createProperty("inputX", 0);
		this._inputY = this.createProperty("inputY", 0);
		this._inputWidth = this.createProperty("inputWidth", 100);
		this._inputHeight = this.createProperty("inputHeight", 100);
		
		this._graphicsUpdate.connectInput(this._mesh);
		this._graphicsUpdate.connectInput(this._inputX);
		this._graphicsUpdate.connectInput(this._inputY);
		this._graphicsUpdate.connectInput(this._inputWidth);
		this._graphicsUpdate.connectInput(this._inputHeight);
		
		this._lineIntersection = (new LineIntersection2d()).init();
		this._linePoint = Point.create();
		this._lineVector = Point.create();
		this._tempVector = Point.create();
		
		return this;
	};
	
	objectFunctions.applyEffect = function(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::applyEffect");
		//console.log(aInputGraphics, aOutputGraphics, aWidth, aHeight, aOffsetX, aOffsetY);
		
		var inputImageData = aInputGraphics.getImageData(0, 0, aWidth, aHeight);
		var outputImageData = aOutputGraphics.getImageData(0, 0, aWidth, aHeight);
		
		var inputData = inputImageData.data;
		var outputData = outputImageData.data;
		
		var mesh = this._mesh.getValueWithoutFlow();
		
		var inputX = this._inputX.getValueWithoutFlow();
		var inputY = this._inputY.getValueWithoutFlow();
		var inputWidth = this._inputWidth.getValueWithoutFlow();
		var inputHeight = this._inputHeight.getValueWithoutFlow();
		
		console.log(mesh);
		var startPoint = mesh.getValue(0, 0);
		var boundsMinX = startPoint.x;
		var boundsMinY = startPoint.y;
		var boundsMaxX = startPoint.x;
		var boundsMaxY = startPoint.y;
		
		var numberOfPointsX = mesh.getDimesionLength(0);
		var numberOfPointsY = mesh.getDimesionLength(1);
		
		var maxPointX = numberOfPointsX-1;
		var maxPointY = numberOfPointsY-1;
		
		for(var i = 0; i < numberOfPointsX; i++) {
			var topPoint = mesh.getValue(i, 0);
			var bottomPoint = mesh.getValue(i, maxPointY);
			
			if(topPoint.x < boundsMinX) boundsMinX = topPoint.x;
			if(topPoint.x > boundsMaxX) boundsMaxX = topPoint.x;
			if(topPoint.y < boundsMinY) boundsMinY = topPoint.y;
			if(topPoint.y > boundsMaxY) boundsMaxY = topPoint.y;
			
			if(bottomPoint.x < boundsMinX) boundsMinX = bottomPoint.x;
			if(bottomPoint.x > boundsMaxX) boundsMaxX = bottomPoint.x;
			if(bottomPoint.y < boundsMinY) boundsMinY = bottomPoint.y;
			if(bottomPoint.y > boundsMaxY) boundsMaxY = bottomPoint.y;
		}
		for(var i = 0; i < numberOfPointsY; i++) {
			var leftPoint = mesh.getValue(0, i);
			var rightPoint = mesh.getValue(maxPointX, i);
			
			if(leftPoint.x < boundsMinX) boundsMinX = leftPoint.x;
			if(leftPoint.x > boundsMaxX) boundsMaxX = leftPoint.x;
			if(leftPoint.y < boundsMinY) boundsMinY = leftPoint.y;
			if(leftPoint.y > boundsMaxY) boundsMaxY = leftPoint.y;
			
			if(rightPoint.x < boundsMinX) boundsMinX = rightPoint.x;
			if(rightPoint.x > boundsMaxX) boundsMaxX = rightPoint.x;
			if(rightPoint.y < boundsMinY) boundsMinY = rightPoint.y;
			if(rightPoint.y > boundsMaxY) boundsMaxY = rightPoint.y;
		}
		
		
		
		boundsMinY = Math.max(0, boundsMinY);
		boundsMaxY = Math.min(aHeight, boundsMaxY);
		
		var currentSquareX = -1;
		var currentSquareY = -1;
		
		this._linePoint.x = boundsMinX;
		this._lineVector.x = boundsMaxX-boundsMinX;
		
		for(var i = boundsMinY; i < boundsMaxY; i++) {
			
			this._linePoint.x = boundsMinX;
			this._linePoint.y = i;
			var currentParameter = -1;
			
			var intersectionsArray = new Array();
			this._getLineScanBorderIntersection(this._linePoint, this._lineVector, mesh, 0, 0, numberOfPointsX-1, numberOfPointsY-1, intersectionsArray);
			//METODO: order array
			
			var debugCounter = 0;
			while(true) {
				if(debugCounter++ > 10000) {
					//METODO: error message
					break;
				}
				var currentData = this._getFirstIntersection(intersectionsArray, currentParameter);
				if(currentData === null) {
					break;
				}
				while(true) {
					if(debugCounter++ > 10000) {
						//METODO: error message
						break;
					}
					var currentBoxIntersections = new Array();
					var currentDirection = currentData.direction;
					if(currentDirection%2 !== 0) {
						this._getLineScanBorderIntersection(this._linePoint, this._lineVector, mesh, Math.max(0, currentData.x-1), currentData.y, Math.min(currentData.x+1, maxPointX), Math.min(currentData.y+1, maxPointY), currentBoxIntersections);
					}
					else {
						this._getLineScanBorderIntersection(this._linePoint, this._lineVector, mesh, currentData.x, Math.max(0, currentData.y-1), Math.min(currentData.x+1, maxPointX), Math.min(currentData.y+1, maxPointY), currentBoxIntersections);
					}
					var nextData = this._getFirstIntersection(currentBoxIntersections, currentData.parameter);
					if(nextData !== null) {
						
						var inputStartX = inputX;
						var inputStartY = inputY;
						var inputEndX = inputX;
						var inputEndY = inputY;
						
						if(currentDirection%2 === 0) {
							inputStartY += currentData.y*inputHeight/maxPointY;
							inputStartX += (currentData.x+currentData.secondaryParameter)*inputWidth/maxPointX;
						}
						else {
							inputStartX += currentData.x*inputWidth/maxPointX;
							inputStartY += (currentData.y+currentData.secondaryParameter)*inputHeight/maxPointY;
						}
						
						if(nextData.direction%2 === 0) {
							inputEndY += nextData.y*inputHeight/maxPointY;
							inputEndX += (nextData.x+nextData.secondaryParameter)*inputWidth/maxPointX;
						}
						else {
							inputEndX += nextData.x*inputWidth/maxPointX;
							inputEndY += (nextData.y+nextData.secondaryParameter)*inputHeight/maxPointY;
						}
						
						var startPixel = currentData.parameter*(boundsMaxX-boundsMinX)+boundsMinX;
						var endPixel = nextData.parameter*(boundsMaxX-boundsMinX)+boundsMinX;
						for(var j = Math.ceil(startPixel); j <= endPixel; j++) {
							var parameter = (j-startPixel)/(endPixel-startPixel);
							
							var inputDataX = Math.round(parameter*(inputEndX-inputStartX)+inputStartX);
							var inputDataY = Math.round(parameter*(inputEndY-inputStartY)+inputStartY);
							var inputPosition = this._getDataPosition(inputDataX, inputDataY, aWidth, aHeight);
							var outputPosition = this._getDataPosition(j, i, aWidth, aHeight);
							
							outputData[outputPosition] = inputData[inputPosition];
							outputData[outputPosition+1] = inputData[inputPosition+1];
							outputData[outputPosition+2] = inputData[inputPosition+2];
							outputData[outputPosition+3] = inputData[inputPosition+3];
						}
						
						currentData = nextData;
						currentParameter = nextData.parameter;
					}
					else {
						break;
					}
				}
			}
		}
		
		aOutputGraphics.putImageData(outputImageData, 0, 0);
	};
	
	objectFunctions._getFirstIntersection = function(aIntersections, aMinParameter) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::_getFirstIntersection");
		//console.log(aIntersections, aMinParameter);
		
		var currentArray = aIntersections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIntersection = currentArray.shift();
			if(currentIntersection.parameter > aMinParameter) {
				return currentIntersection;
			}
		}
		return null;
	};
	
	objectFunctions._getLineScanBorderIntersection = function(aLinePoint, aLineVector, aMesh, aStartX, aStartY, aEndX, aEndY, aReturnArray) {
		//console.log("com.developedbyme.utils.canvas.pixeleffects.distort.MeshDeformationEffect::_getLineScanBorderIntersection");
		
		var y = aLinePoint.y;
		
		var lastPoint1 = aMesh.getValue(aStartX, aStartY);
		var lastPoint2 = aMesh.getValue(aStartX, aEndY);
		
		for(var i = aStartX+1; i <= aEndX; i++) {
			var point1 = aMesh.getValue(i, aStartY);
			var point2 = aMesh.getValue(i, aEndY);
			
			if(y >= lastPoint1.y && y <= point1.y || y <= lastPoint1.y && y >= point1.y) {
				this._tempVector.x = point1.x-lastPoint1.x;
				this._tempVector.y = point1.y-lastPoint1.y;
				var intersectionResult = this._lineIntersection.findLineIntersection(aLinePoint, aLineVector, lastPoint1, this._tempVector);
				
				if(intersectionResult) {
					aReturnArray.push({"parameter": this._lineIntersection.parameter1, "secondaryParameter": this._lineIntersection.parameter2, "x": i-1, "y": aStartY, "direction": 0});
				}
			}
			if(y >= lastPoint2.y && y <= point2.y || y <= lastPoint1.y && y >= point1.y) {
				this._tempVector.x = point2.x-lastPoint2.x;
				this._tempVector.y = point2.y-lastPoint2.y;
				var intersectionResult = this._lineIntersection.findLineIntersection(aLinePoint, aLineVector, lastPoint2, this._tempVector);
				
				if(intersectionResult) {
					aReturnArray.push({"parameter": this._lineIntersection.parameter1, "secondaryParameter": this._lineIntersection.parameter2, "x": i-1, "y": aEndY, "direction": 2});
				}
			}
			
			lastPoint1 = point1;
			lastPoint2 = point2;
		}
		
		var lastPoint1 = aMesh.getValue(aStartX, aStartY);
		var lastPoint2 = aMesh.getValue(aEndX, aStartY);
		
		for(var i = aStartY+1; i <= aEndY; i++) {
			var point1 = aMesh.getValue(aStartX, i);
			var point2 = aMesh.getValue(aEndX, i);
			
			if(y >= lastPoint1.y && y <= point1.y || y <= lastPoint1.y && y >= point1.y) {
				this._tempVector.x = point1.x-lastPoint1.x;
				this._tempVector.y = point1.y-lastPoint1.y;
				var intersectionResult = this._lineIntersection.findLineIntersection(aLinePoint, aLineVector, lastPoint1, this._tempVector);
				
				if(intersectionResult) {
					aReturnArray.push({"parameter": this._lineIntersection.parameter1, "secondaryParameter": this._lineIntersection.parameter2, "x": aStartX, "y": i-1, "direction": 1});
				}
			}
			if(y >= lastPoint2.y && y <= point2.y || y <= lastPoint2.y && y >= point2.y) {
				this._tempVector.x = point2.x-lastPoint2.x;
				this._tempVector.y = point2.y-lastPoint2.y;
				var intersectionResult = this._lineIntersection.findLineIntersection(aLinePoint, aLineVector, lastPoint2, this._tempVector);
				
				if(intersectionResult) {
					aReturnArray.push({"parameter": this._lineIntersection.parameter1, "secondaryParameter": this._lineIntersection.parameter2, "x": aEndX, "y": i-1, "direction": 3});
				}
			}
			
			lastPoint1 = point1;
			lastPoint2 = point2;
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
		
		this._mesh = null;
		this._inputX = null;
		this._inputY = null;
		this._inputWidth = null;
		this._inputHeight = null;
	};
	
	staticFunctions.create = function(aMesh, aX, aY, aWidth, aHeight) {
		var newMeshDeformationEffect = (new ClassReference()).init();
		
		newMeshDeformationEffect.setPropertyInputWithoutNull("mesh", aMesh);
		newMeshDeformationEffect.setPropertyInputWithoutNull("inputX", aX);
		newMeshDeformationEffect.setPropertyInputWithoutNull("inputY", aY);
		newMeshDeformationEffect.setPropertyInputWithoutNull("inputWidth", aWidth);
		newMeshDeformationEffect.setPropertyInputWithoutNull("inputHeight", aHeight);
		
		return newMeshDeformationEffect;
	};
});