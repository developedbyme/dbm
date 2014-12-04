/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Generator for drawing illustrator graphics.
 */
dbm.registerClass("dbm.utils.canvas.generators.IllustratorFileGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.generators.IllustratorFileGenerator");
	
	//Self reference
	var IllustratorFileGenerator = dbm.importClass("dbm.utils.canvas.generators.IllustratorFileGenerator");
	
	//Error report
	
	//Dependnecies
	var CanvasRenderLayer2d = dbm.importClass("dbm.utils.canvas.CanvasRenderLayer2d");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	
	//Constants
	
	
	
	staticFunctions.drawLayers = function(aLayers, aParentLayer, aCanvasController) {
		//console.log("dbm.utils.canvas.generators.IllustratorFileGenerator::drawLayers");
		
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[currentArrayLength-i-1];
			ClassReference.drawLayer(currentTreeStructureItem, aParentLayer, aCanvasController);
		}
	};
	
	staticFunctions.drawLayer = function(aTreestructureItem, aParentLayer, aCanvasController) {
		//console.log("dbm.utils.canvas.generators.IllustratorFileGenerator::drawLayer");
		
		var currentLayerMetaData = aTreestructureItem.data.metaData;
		var currentLayerData = aTreestructureItem.data.data;
		var transfomationData = currentLayerData.transformation;
		
		var layerType = currentLayerMetaData.getObject("type");
		
		
		var newLayer = null;
		var layerName = aTreestructureItem.getName();
		
		if(layerType === "compoundPath") {
			
			var newTreeStrcutureItem = TreeStructureItem.create(layerName);
			
			//METODO: set size dynamically
			var renderWidth = 2000;
			var renderHeight = 2000;
			var renderOffsetX = -1000;
			var renderOffsetY = -1000;
			
			var renderLayer = CanvasRenderLayer2d.create(renderOffsetX, renderOffsetY, renderWidth, renderHeight);
			renderLayer.getProperty("x").setValue(transfomationData.x);
			renderLayer.getProperty("y").setValue(transfomationData.y);
			
			newTreeStrcutureItem.data = renderLayer;
			renderLayer._linkRegistration_setTreeStructureItem(newTreeStrcutureItem);
			aParentLayer.getTreeStructureItem().addChild(newTreeStrcutureItem);
			aCanvasController.getProperty("graphicsUpdate").connectInput(renderLayer.getProperty("graphicsUpdate"));
			
			newLayer = renderLayer.getChildByPath("mirrorY");
		}
		else {
			newLayer = aParentLayer.getChildByPath(layerName);
			newLayer.getProperty("x").setValue(transfomationData.x);
			newLayer.getProperty("y").setValue(transfomationData.y);
		}
		
		if(layerType === "path") {
			var strokeData = currentLayerData.object.stroke;
			if(strokeData !== null) {
				//METODO: use all settings
				newLayer.setStrokeStyle(strokeData.lineWidth, strokeData.definition.getCssString()); //MEDEBUG: //
				//newLayer.setStrokeStyle(1, "#000000"); //MEDEBUG
			}
			var fillData = currentLayerData.object.fill;
			if(fillData !== null) {
				if(fillData.definition !== null) {
					//METODO: can this be fixed in the export so that definition can't be null?
					newLayer.setFillStyle(fillData.definition.getCssString());
				}
				
			}
			//METODO: stroke over fill setting
			
			var currentArray2 = currentLayerData.object.curves;
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				newLayer.drawCurve(currentArray2[j]);
			}
		}
		
		ClassReference.drawLayers(aTreestructureItem.getChildren(), newLayer, aCanvasController);
		
		if(layerType === "compoundPath") {
			//METODO: needs to be more sophisicated than a simple xor of everything
			var currentArray2 = newLayer.getTreeStructureItem().getChildren();
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentChildLayer = currentArray2[j].data;
				currentChildLayer.getProperty("compositeOperation").setValue("xor");
			}
		}
	};
});