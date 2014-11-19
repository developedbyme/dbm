/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Exports layers of an after effects composition.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter");
	//"use strict";
	
	//Self reference
	var LayerExporter = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	var ShapeCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	//Utils
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var MetaDataFunctions = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	var TimelineGenerator = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.TimelineGenerator");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	staticFunctions.exportLayers = function(aTreeStructureItems, aReturnParentTreeStructureItem, aNestedCompositions, aFilesToCopy, aPhotoshopLayersToExport) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter::exportLayers");
		//console.log(aTreeStructureItems, aReturnParentTreeStructureItem);
		
		var currentArray = aTreeStructureItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[i];
			var currentLayer = currentTreeStructureItem.data;
			
			if(currentLayer !== null) {
				var layerName = currentLayer.getProperty("name").getValue();
				if(layerName.indexOf("_Slave") !== -1) {
					console.log("Ignoring slave layer " + layerName);
					continue;
				}
			}
			
			
			var newItem = TreeStructureItem.create(currentTreeStructureItem.getName());
			aReturnParentTreeStructureItem.addChild(newItem);
			
			var layerData = MetaDataObject.create();
			newItem.data = layerData;
			var layerMetaData = layerData.metaData;
			
			var currentType = currentTreeStructureItem.getAttribute("type");
			layerMetaData.addObject("type", currentType);
			if(currentType === "layer" || currentType === "camera") {
				currentLayer.setupAnimationProperties();
				
				if(currentLayer instanceof AvCompositionLayer) {
					layerMetaData.addObject("width", currentLayer.getProperty("width").getValue());
					layerMetaData.addObject("height", currentLayer.getProperty("height").getValue());
					layerMetaData.addObject("blendingMode", currentLayer.getProperty("blendingMode").getValue());
					
					if(currentLayer instanceof ShapeCompositionLayer) {
						layerMetaData.addObject("footageType", "shape");
						layerMetaData.addObject("shapes", currentLayer.getShapes());
					}
					else {
						var nativeSource = currentLayer.getSource();
						if(nativeSource instanceof FootageItem) {
							var nativeMainSource = nativeSource.mainSource;
							if(nativeMainSource instanceof SolidSource) {
								if(!currentLayer.getNativeItem().nullLayer) {
									layerMetaData.addObject("footageType", "solid");
									var colorArray = nativeMainSource.color;
									layerMetaData.addObject("color", RgbaColor.create(colorArray[0], colorArray[1], colorArray[2]));
								}
								else {
									layerMetaData.addObject("footageType", "none");
								}
							}
							else if(nativeMainSource instanceof FileSource) {
								if(nativeMainSource.missingFootagePath === "") {
								
									var currentFile = nativeMainSource.file;
									var fileName = currentFile.name;
									var fileExtension = PathFunctions.getFileExtension(fileName);
								
									switch(fileExtension) {
										case "png":
										case "jpg":
										case "jpeg":
										case "gif":
											layerMetaData.addObject("footageType", "image");
											//METODO: handle duplicates of filename
											var newFileName = fileName;
											aFilesToCopy.addObject(newFileName, currentFile);
											layerMetaData.addObject("file", newFileName);
											break;
										case "psd":
											layerMetaData.addObject("footageType", "image");
											var sourceName = nativeSource.name;
											var photoshopLayerArray = null;
											var sourceFilePath = currentFile.absoluteURI;
											if(aPhotoshopLayersToExport.select(sourceFilePath)) {
												photoshopLayerArray = aPhotoshopLayersToExport.currentSelectedItem;
											}
											else {
												photoshopLayerArray = NamedArray.create(true);
												photoshopLayerArray.setDynamicVariable("exportType", "psdLayers");
												aPhotoshopLayersToExport.addObject(sourceFilePath, photoshopLayerArray);
											}
										
											var layerName = sourceName.substring(0, sourceName.lastIndexOf("/"));
											var folderName = fileName.substring(0, fileName.lastIndexOf("."));
											var outputName = StringFunctions.convertToSafeFileName(folderName) + "/" + StringFunctions.convertToSafeFileName(layerName) + ".png";
											photoshopLayerArray.addObject(layerName, outputName);
											layerMetaData.addObject("file", outputName);
											break;
										case "ai":
											layerMetaData.addObject("footageType", "vectorGraphics");
											var sourceName = nativeSource.name;
											var sourceFilePath = currentFile.absoluteURI;
											
											var layerName = sourceName.substring(0, sourceName.lastIndexOf("/"));
											var folderName = fileName.substring(0, fileName.lastIndexOf("."));
											var outputName = StringFunctions.convertToSafeFileName(folderName) + ".xml";
											
											if(!aPhotoshopLayersToExport.select(sourceFilePath)) {
												var newLayerArray = NamedArray.create(true);
												newLayerArray.setDynamicVariable("exportType", "aiFile");
												aPhotoshopLayersToExport.addObject(sourceFilePath, newLayerArray);
												newLayerArray.addObject("main", outputName);
											}
											
											layerMetaData.addObject("file", outputName);
											layerMetaData.addObject("layer", layerName);
											break;
										case "mov":
											layerMetaData.addObject("footageType", "video");
											var sourceName = nativeSource.name;
											var sourceFilePath = currentFile.absoluteURI;
											
											var folderName = fileName.substring(0, fileName.lastIndexOf("."));
											var outputName = StringFunctions.convertToSafeFileName(folderName) + ".[video]";
											
											if(!aPhotoshopLayersToExport.select(sourceFilePath)) {
												var newLayerArray = NamedArray.create(true);
												newLayerArray.setDynamicVariable("exportType", "video");
												aPhotoshopLayersToExport.addObject(sourceFilePath, newLayerArray);
												newLayerArray.addObject("main", outputName);
												newLayerArray.addObject("item", nativeSource);
											}
											
											layerMetaData.addObject("file", outputName);
											break;
										default:
											//MENOTE: add video
											layerMetaData.addObject("footageType", "missingFile");
											console.error("Unsupported file type " + fileExtension + ". Can't export " + fileName);
											//console.log(nativeSource.name);
											//console.log(nativeSource.comment);
											//console.log(nativeSource.id);
											//console.log(currentFile);
											//console.log("-", nativeMainSource);
											break;
									}
								}
								else {
									layerMetaData.addObject("footageType", "missingFile");
								}
							}
							else {
								//METODO: add other types
								console.error("Unknown main source " + nativeMainSource.toString());
								layerMetaData.addObject("footageType", "unknown");
							}
						}
						else if(nativeSource instanceof CompItem) {
							layerMetaData.addObject("footageType", "composition");
							
							var compositionIndex = ArrayFunctions.indexOfInArray(aNestedCompositions, nativeSource);
							console.log(compositionIndex, nativeSource.name);
							if(compositionIndex === -1) {
								compositionIndex = aNestedCompositions.length;
								aNestedCompositions.push(nativeSource);
							}
							layerMetaData.addObject("composition", compositionIndex);
						}
						else {
							//METODO: add other types
							console.error("Unknown source " + nativeSource.toString());
						}
					}
				}
				layerMetaData.addObject("masks", currentLayer.getMasks());
				
				MetaDataFunctions.setLayerMetaData(currentLayer, layerMetaData);
				
				var timelinesArray = PropertiesHolder.create();
				layerData.data = timelinesArray;
				
				
				ClassReference.exportLayerProperties(currentLayer, timelinesArray);
			}
			else if(currentType === "trackMatte") {
				layerMetaData.addObject("trackMatteType", currentTreeStructureItem.getAttribute("trackMatteType"));
			}
			
			ClassReference.exportLayers(currentTreeStructureItem.getChildren(), newItem, aNestedCompositions, aFilesToCopy, aPhotoshopLayersToExport);
		}
		//console.log("//com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter::exportLayers");
	};
	
	staticFunctions.exportLayerProperties = function(aLayer, aReturnPropertiesHolder) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter::exportLayerProperties");
		var currentAnimationProperties = aLayer.getAnimationProperties();
		var currentArray = currentAnimationProperties.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentProperty = currentAnimationProperties.getObject(currentName);
			TimelineGenerator.createTimelinesForProprety(currentProperty, currentName, aReturnPropertiesHolder);
		}
	};
});