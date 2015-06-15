/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting the animation in the active composition.
 */
dbm.registerClass("dbm.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ExportActiveCompositionAnimationApplication = dbm.importClass("dbm.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var AfterEffectsProject = dbm.importClass("dbm.adobeextendscript.aftereffects.AfterEffectsProject");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	var InterpolationTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var AnimationCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var FileWriter = dbm.importClass("dbm.adobeextendscript.utils.file.FileWriter");
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var AvCompositionLayer = dbm.importClass("dbm.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	var ShapeCompositionLayer = dbm.importClass("dbm.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	var SpatialCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var CreateArcLengthCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateArcLengthCurveNode");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	var RgbaColor = dbm.importClass("dbm.core.data.color.RgbaColor");
	var MultiplePartsTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	var BlendCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	var UrlResolver = dbm.importClass("dbm.utils.file.UrlResolver");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var BridgeClassRunner = dbm.importClass("dbm.adobeextendscript.utils.bridge.BridgeClassRunner");
	
	//Utils
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var PathFunctions = dbm.importClass("dbm.utils.file.PathFunctions");
	var MetaDataFunctions = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	var LayerExporter = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.LayerExporter");
	var CompositionExporter = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.CompositionExporter");
	
	//Constants
	var InterpolationTypes = dbm.importClass("dbm.constants.generic.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_init");
		
		this.superCall();
		
		this._project = null;
		this._activeComposition = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_createPage");
		
		this._project = AfterEffectsProject.create();
		this._activeComposition = this._project.getActiveItem();
		
		
		var filesToCopy = NamedArray.create(false);
		var photoshopLayersToExport = NamedArray.create(false);
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("afterEffectsComposition");
		exportObject.metaData.addObject("mainComposition", 0);
		
		var compositions = new Array();
		exportObject.data = compositions;
		
		var nativeCompositions = new Array();
		nativeCompositions.push(this._activeComposition.getNativeItem());
		
		CompositionExporter.exportCompositions(nativeCompositions, this._project, filesToCopy, photoshopLayersToExport, compositions);
		
		/*
		var compositionMetaData = MetaDataObject.create();
		compositions.push(compositionMetaData);
		
		
		MetaDataFunctions.setCompositionMetaData(this._activeComposition, compositionMetaData.metaData);
		
		var exportedLayerData = TreeStructure.create();
		compositionMetaData.data = exportedLayerData;
		
		LayerExporter.exportLayers(this._activeComposition.getLayers(), exportedLayerData.getRoot(), nativeCompositions, filesToCopy, photoshopLayersToExport);
		*/
		console.log("Generate xml");
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFile = FileWriter.createWithPrompt("~/export.xml");
		if(saveFile !== null) {
			this._project.deselectAllItems();
			
			saveFile.setData(encodedXml);
			saveFile.write();
			
			var saveUrlResolver = UrlResolver.createFromFilePath(saveFile._url); //METODO: do not access private variable
			
			var currentArray = filesToCopy.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentName = currentArray[i];
				var currentFile = filesToCopy.getObject(currentName);
				
				var newFilePath = saveUrlResolver.getAbsolutePath(currentName);
				var result = currentFile.copy(newFilePath);
			}
			this._exportPhotoshopLayers(photoshopLayersToExport, saveUrlResolver);
			
			this._activeComposition.getNativeItem().selected = true;
		}
		
		
	};
	
	objectFunctions._exportPhotoshopLayers = function(aPhotoshopLayersToExport, aUrlResolver) {
		//console.log("dbm.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_exportPhotoshopLayers");
		//console.log(aPhotoshopLayersToExport, aUrlResolver);
		
		var dataObject = new Object();
		var illustratorDataObject = new Object();
		var exportPhotoshop = false;
		var exportIllustrator = false;
		var render = false;
		
		var currentArray = aPhotoshopLayersToExport.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0 ; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentFileData = aPhotoshopLayersToExport.getObject(currentName);
			var exportType = currentFileData.getDynamicVariable("exportType");
			
			if(exportType === "psdLayers") {
				exportPhotoshop = true;
				var fileData = new Object();
				dataObject[currentName] = fileData;
			
				var currentArray2 = currentFileData.getNamesArray();
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentLayerName = currentArray2[j];
					fileData[currentLayerName] = aUrlResolver.getAbsolutePath(currentFileData.getObject(currentLayerName));
				}
			}
			else if(exportType === "aiFile") {
				exportIllustrator = true;
				illustratorDataObject[currentName] = aUrlResolver.getAbsolutePath(currentFileData.getObject("main"));
			}
			else if(exportType === "video") {
				render = true;
				
				//METODO: check if output already exists
				
				var filePath = aUrlResolver.getAbsolutePath(currentFileData.getObject("main"));
				var videoItem = currentFileData.getObject("item");
				videoItem.selected = true;
				app.executeCommand(app.findMenuCommandId("Add to Render Queue"));
				videoItem.selected = false;
				
				var renderQueueItem = app.project.renderQueue.item(app.project.renderQueue.numItems);
				
				var outputModule = renderQueueItem.outputModule(1);
				outputModule.applyTemplate("dbmExport-h264");
				
				var outputFile = new File(filePath.split("[video]").join("mov"));
				outputModule.file = outputFile;
				
				renderQueueItem.comp.selected = true;
				app.executeCommand(app.findMenuCommandId("Add to Render Queue"));
				renderQueueItem.selected = false;
				
				var renderQueueItem = app.project.renderQueue.item(app.project.renderQueue.numItems);
				
				var outputModule = renderQueueItem.outputModule(1);
				outputModule.applyTemplate("dbmExport-pngSequence");
				
				var imageSequenceFolderPath = filePath.split("[video]").join("imageSequence");
				var imageSequenceFolder = new Folder(imageSequenceFolderPath);
				imageSequenceFolder.create();
				
				var outputFile = new File(imageSequenceFolderPath + "/image.[#####].png");
				outputModule.file = outputFile;
				
				app.project.renderQueue.render();
				renderQueueItem.comp.remove();
				
				var newFileName = filePath.split("[video]").join("mp4");
				newFileName = newFileName.substring(newFileName.lastIndexOf("/")+1, newFileName.length);
				outputFile.rename(newFileName);
			}
		}
		
		if(exportPhotoshop) {
			var bridgeConnection = BridgeClassRunner.create("photoshop", "dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication", dataObject);
			bridgeConnection.perform();
		}
		if(exportIllustrator) {
			var bridgeConnection = BridgeClassRunner.create("illustrator", "dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication", illustratorDataObject);
			bridgeConnection.perform();
		}
		//if(render) {
		//	app.project.renderQueue.render();
		//	console.log(">>>>>>>");
		//}
		
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});