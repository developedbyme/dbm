/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.setup.display.SetupPlacementFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.setup.display.SetupPlacementFunctions");
	//"use strict";
	
	//Self reference
	var SetupPlacementFunctions = dbm.importClass("dbm.flow.setup.display.SetupPlacementFunctions");
	
	//Error report
	
	//Dependencies
	var ScaleAndPositionRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ScaleAndPositionRectangleNode");
	var ValuesFromRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	var PositionRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.PositionRectangleNode");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.setupScaleAndPositionOfDisplayObject = function(aInputRectangle, aOuterParameterX, aOuterParameterY, aInnerParamterX, aInnerParameterY, aOffsetX, aOffsetY, aScaleX, aScaleY, aScaleOffsetX, aScaleOffsetY, aOutputDisplayObject, aReturnNodesArray) {
		
		aReturnNodesArray = VariableAliases.valueWithDefault(aReturnNodesArray, aOutputDisplayObject.getDestroyableObjectsArray());
		
		var scaleAndPositionNode = ScaleAndPositionRectangleNode.create(aInputRectangle, aOuterParameterX, aOuterParameterY, aInnerParamterX, aInnerParameterY, aOffsetX, aOffsetY, aScaleX, aScaleY, aScaleOffsetX, aScaleOffsetY);
		aReturnNodesArray.push(scaleAndPositionNode);
		
		var valuesFromRectangleNode = ValuesFromRectangleNode.create(scaleAndPositionNode.getProperty("outputRectangle"));
		aReturnNodesArray.push(valuesFromRectangleNode);
		
		aOutputDisplayObject.setElementAsPositioned();
		
		aOutputDisplayObject.setPropertyInput("x", valuesFromRectangleNode.getProperty("x"));
		aOutputDisplayObject.setPropertyInput("y", valuesFromRectangleNode.getProperty("y"));
		aOutputDisplayObject.setPropertyInput("width", valuesFromRectangleNode.getProperty("width"));
		aOutputDisplayObject.setPropertyInput("height", valuesFromRectangleNode.getProperty("height"));
	};
	
	staticFunctions.setupPositionOfDisplayObject = function(aInputRectangle, aOuterParameterX, aOuterParameterY, aInnerParamterX, aInnerParameterY, aOffsetX, aOffsetY, aOutputDisplayObject, aReturnNodesArray) {
		
		aReturnNodesArray = VariableAliases.valueWithDefault(aReturnNodesArray, aOutputDisplayObject.getDestroyableObjectsArray());
		
		var sizeOfElementNode = SizeOfElementNode.create(aOutputDisplayObject.getProperty("element"));
		aReturnNodesArray.push(sizeOfElementNode);
		
		var rectangleFromValuesNode = RectangleFromValuesNode.create(0, 0, sizeOfElementNode.getProperty("width"), sizeOfElementNode.getProperty("height"));
		aReturnNodesArray.push(rectangleFromValuesNode);
		
		var positionNode = PositionRectangleNode.create(aInputRectangle, rectangleFromValuesNode.getProperty("outputRectangle"), aOuterParameterX, aOuterParameterY, aInnerParamterX, aInnerParameterY, aOffsetX, aOffsetY);
		aReturnNodesArray.push(positionNode);
		
		var valuesFromRectangleNode = ValuesFromRectangleNode.create(positionNode.getProperty("outputRectangle"));
		aReturnNodesArray.push(valuesFromRectangleNode);
		
		aOutputDisplayObject.setElementAsPositioned();
		
		aOutputDisplayObject.setPropertyInput("x", valuesFromRectangleNode.getProperty("x"));
		aOutputDisplayObject.setPropertyInput("y", valuesFromRectangleNode.getProperty("y"));
	};
});
