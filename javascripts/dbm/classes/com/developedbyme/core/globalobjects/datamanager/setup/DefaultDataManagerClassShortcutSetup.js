/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup");
	
	//Self reference
	var DefaultDataManagerClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup");
	
	//Error report
	
	//Dependencies
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var ExportMetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	var AnimationCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	var SpatialCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var MultiplePartsTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	var BlendCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	var ColorStop = dbm.importClass("com.developedbyme.utils.graphics.gradient.ColorStop");
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var Gradient = dbm.importClass("com.developedbyme.utils.graphics.gradient.Gradient");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var ShapeData = dbm.importClass("com.developedbyme.core.data.graphics.ShapeData");
	var FillData = dbm.importClass("com.developedbyme.core.data.graphics.FillData");
	var StrokeData = dbm.importClass("com.developedbyme.core.data.graphics.StrokeData");
	var TransformedObjectData = dbm.importClass("com.developedbyme.core.data.graphics.TransformedObjectData");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.setup = function() {
		
		
	};
});