/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.geometry.creators.BoxCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.geometry.creators.BoxCreator");
	
	var BoxCreator = dbm.importClass("com.developedbyme.utils.geometry.creators.BoxCreator");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var PlaneCreator = dbm.importClass("com.developedbyme.utils.geometry.creators.PlaneCreator");
	
	staticFunctions.createRectangularBox = function(aMesh, aX, aY, aZ, aWidth, aHeight, aDepth, aWidthSections, aHeightSections, aDepthSections) {
		
		var tempPoint = Point.create();
		var tempHorizontalVector = Point.create();
		var tempVerticalVector = Point.create();
		
		var tempUvPoint = Point.create();
		var tempUvHorizontalVector = Point.create();
		var tempUvVerticalVector = Point.create();
		
		var horizontalSections;
		var verticalSections;
		
		//Front
		tempPoint.setValues(aX-0.5*aWidth, aY-0.5*aHeight, aZ+0.5*aDepth);
		tempHorizontalVector.setValues(aWidth, 0, 0);
		tempVerticalVector.setValues(0, aHeight, 0);
		horizontalSections = aWidthSections;
		verticalSections = aHeightSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		//Right
		tempPoint.setValues(aX+0.5*aWidth, aY-0.5*aHeight, aZ+0.5*aDepth);
		tempHorizontalVector.setValues(0, 0, -1*aDepth);
		tempVerticalVector.setValues(0, aHeight, 0);
		horizontalSections = aDepthSections;
		verticalSections = aHeightSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		//Back
		tempPoint.setValues(aX+0.5*aWidth, aY-0.5*aHeight, aZ-0.5*aDepth);
		tempHorizontalVector.setValues(-1*aWidth, 0, 0);
		tempVerticalVector.setValues(0, aHeight, 0);
		horizontalSections = aWidthSections;
		verticalSections = aHeightSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		//Left
		tempPoint.setValues(aX-0.5*aWidth, aY-0.5*aHeight, aZ-0.5*aDepth);
		tempHorizontalVector.setValues(0, 0, aDepth);
		tempVerticalVector.setValues(0, aHeight, 0);
		horizontalSections = aDepthSections;
		verticalSections = aHeightSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		//Top
		tempPoint.setValues(aX-0.5*aWidth, aY+0.5*aHeight, aZ+0.5*aDepth);
		tempHorizontalVector.setValues(aWidth, 0, 0);
		tempVerticalVector.setValues(0, 0, -1*aDepth);
		horizontalSections = aWidthSections;
		verticalSections = aDepthSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		//Bottom
		tempPoint.setValues(aX+0.5*aWidth, aY-0.5*aHeight, aZ+0.5*aDepth);
		tempHorizontalVector.setValues(-1*aWidth, 0, 0);
		tempVerticalVector.setValues(0, 0, -1*aDepth);
		horizontalSections = aWidthSections;
		verticalSections = aDepthSections;
		//METODO: set uv points
		PlaneCreator.createPlane(aMesh, tempPoint, tempHorizontalVector, tempVerticalVector, tempUvPoint, tempUvHorizontalVector, tempUvVerticalVector);
		
		return aMesh;
	};
});