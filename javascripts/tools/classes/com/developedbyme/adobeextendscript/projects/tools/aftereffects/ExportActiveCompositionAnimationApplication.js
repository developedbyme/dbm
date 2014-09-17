/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting the animation in the active composition.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ExportActiveCompositionAnimationApplication = dbm.importClass("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var AfterEffectsProject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var InterpolationTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var AnimationCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var FileWriter = dbm.importClass("com.developedbyme.adobeextendscript.utils.file.FileWriter");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	var ShapeCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var SpatialCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var CreateArcLengthCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateArcLengthCurveNode");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var MultiplePartsTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	var BlendCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var BridgeClassRunner = dbm.importClass("com.developedbyme.adobeextendscript.utils.bridge.BridgeClassRunner");
	
	//Utils
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var MetaDataFunctions = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	var LayerExporter = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.LayerExporter");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_init");
		
		this.superCall();
		
		this._project = null;
		this._activeComposition = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_createPage");
		
		this._project = AfterEffectsProject.create();
		this._activeComposition = this._project.getActiveItem();
		
		var filesToCopy = NamedArray.create(false);
		var photoshopLayersToExport = NamedArray.create(false);
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("afterEffectsComposition");
		
		var compositionMetaData = MetaDataObject.create();
		exportObject.data = compositionMetaData;
		
		MetaDataFunctions.setCompositionMetaData(this._activeComposition, compositionMetaData.metaData);
		
		var exportedLayerData = TreeStructure.create();
		compositionMetaData.data = exportedLayerData;
		
		LayerExporter.exportLayers(this._activeComposition.getLayers(), exportedLayerData.getRoot(), filesToCopy, photoshopLayersToExport);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFile = FileWriter.createWithPrompt("~/export.xml");
		if(saveFile !== null) {
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
		}
	};
	
	objectFunctions._exportPhotoshopLayers = function(aPhotoshopLayersToExport, aUrlResolver) {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.aftereffects.ExportActiveCompositionAnimationApplication::_exportPhotoshopLayers");
		//console.log(aPhotoshopLayersToExport, aUrlResolver);
		
		var dataObject = new Object();
		
		var currentArray = aPhotoshopLayersToExport.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0 ; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentFileData = aPhotoshopLayersToExport.getObject(currentName);
			var fileData = new Object();
			dataObject[currentName] = fileData;
			
			var currentArray2 = currentFileData.getNamesArray();
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentLayerName = currentArray2[j];
				fileData[currentLayerName] = aUrlResolver.getAbsolutePath(currentFileData.getObject(currentLayerName));
			}
		}
		
		var bridgeConnection = BridgeClassRunner.create("photoshop", "com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication", dataObject);
		bridgeConnection.perform();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});