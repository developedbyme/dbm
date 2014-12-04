/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup");
	
	//Self reference
	var DefaultDataManagerClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup");
	
	//Error report
	
	//Dependencies
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var ExportMetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	var AnimationCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	var SpatialCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var MultiplePartsTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	var BlendCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	var ColorStop = dbm.importClass("dbm.utils.graphics.gradient.ColorStop");
	var RgbaColor = dbm.importClass("dbm.core.data.color.RgbaColor");
	var CmykColor = dbm.importClass("dbm.core.data.color.CmykColor");
	var Gradient = dbm.importClass("dbm.utils.graphics.gradient.Gradient");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var ShapeData = dbm.importClass("dbm.core.data.graphics.ShapeData");
	var FillData = dbm.importClass("dbm.core.data.graphics.FillData");
	var StrokeData = dbm.importClass("dbm.core.data.graphics.StrokeData");
	var TransformedObjectData = dbm.importClass("dbm.core.data.graphics.TransformedObjectData");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.setup = function() {
		
		
	};
});