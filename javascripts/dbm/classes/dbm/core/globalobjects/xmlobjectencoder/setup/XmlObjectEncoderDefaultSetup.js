/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global xml object encoder.
 */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	//"use strict";
	
	//Self reference
	var XmlObjectEncoderDefaultSetup = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	
	//Error report
	
	//Dependencies
	var TimelineEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder");
	var InterpolationTimelinePartEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	var EncodingBaseObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	var PointsArrayEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder");
	var NamedArrayEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder");
	var ExportMetaDataEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder");
	var GradientEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder");
	var TreeStructureEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder");
	var TreeStructureItemEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder");
	var PropertiesHolderEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder");
	
	//Utils
	
	//Constants
	var XmlEncoderCustomTypes = dbm.importClass("dbm.constants.xml.XmlEncoderCustomTypes");
	
	/**
	 * Sets up the default encoders.
	 */
	staticFunctions.setup = function() {
		ClassReference.setupTimeline();
	};
	
	/**
	 * Sets up encoders for timeline encoders.
	 */
	staticFunctions.setupTimeline = function() {
		
		//Custom type encoders
		dbm.singletons.dbmXmlObjectEncoder.addCustomTypeEncoder(XmlEncoderCustomTypes.POINTS_ARRAY, PointsArrayEncoder.create());
		dbm.singletons.dbmXmlObjectEncoder.addClassCustomType("dbm.utils.data.treestructure.TreeStructure", XmlEncoderCustomTypes.TREE_STRUCTURE, TreeStructureEncoder.create().addVariablesToEncode(["createMissingItems", "ownsData"]));
		dbm.singletons.dbmXmlObjectEncoder.addClassCustomType("dbm.utils.data.treestructure.TreeStructureItem", XmlEncoderCustomTypes.TREE_STRUCTURE_ITEM, TreeStructureItemEncoder.create().addVariablesToEncode(["data"]));
		
		//Class encoders
		var namedArrayEncoder = NamedArrayEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.utils.data.NamedArray", namedArrayEncoder);
		
		var timelineEncoder = TimelineEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.core.globalobjects.animationmanager.timeline.Timeline", timelineEncoder);
		
		var interpolationTimelinePartEncoder = InterpolationTimelinePartEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart", interpolationTimelinePartEncoder);
		
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.flow.PropertiesHolder", PropertiesHolderEncoder.create());
		
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart", ["startTime", "endTime", "startApplyTime", "endApplyTime", "startValue", "endValue"]);
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart", ["startTime", "endTime", "startApplyTime", "endApplyTime", "value"]);
		
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart", ["startTime", "endTime", "startApplyTime", "endApplyTime", "curve", "preInfinityMethod", "postInfinityMethod", "exactness", "startParameter", "endParameter"]);
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart", ["startTime", "endTime", "startApplyTime", "endApplyTime", "curve", "pointProperty", "startParameter", "endParameter"]);
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart", ["startTime", "endTime", "startApplyTime", "endApplyTime", "parts"]);
		
		ClassReference._createEncodingBaseObject("dbm.core.data.curves.BezierCurve", ["pointsArray", "setType", "_curveDegree", "_isCompact"]).addCustomTypeForVariable("pointsArray", XmlEncoderCustomTypes.POINTS_ARRAY); //METODO: shouldn't access private variables
		ClassReference._createEncodingBaseObject("dbm.core.data.points.PointSet", ["pointsArray", "setType"]).addCustomTypeForVariable("pointsArray", XmlEncoderCustomTypes.POINTS_ARRAY);
		ClassReference._createEncodingBaseObject("dbm.core.data.points.Point", ["x", "y", "z", "w"]);
		
		ClassReference._createEncodingBaseObject("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject", ["metaData", "data"]);
		
		var exportMetaDataEncoder = ExportMetaDataEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject", exportMetaDataEncoder);
		
		var gradientEncoder = GradientEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("dbm.utils.graphics.gradient.Gradient", gradientEncoder);
		
		var colorStopEncoder = ClassReference._createEncodingBaseObject("dbm.utils.graphics.gradient.ColorStop", []);
		colorStopEncoder.addPropertyToEncode("position");
		colorStopEncoder.addPropertyToEncode("value");
		
		ClassReference._createEncodingBaseObject("dbm.core.data.color.RgbaColor", ["r", "g", "b", "a"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.color.HslaColor", ["h", "s", "l", "a"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.color.CmykColor", ["c", "m", "y", "k"]);
		
		ClassReference._createEncodingBaseObject("dbm.core.data.graphics.ShapeData", ["stroke", "fill", "strokeOverFill", "curves"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.graphics.FillData", ["definition"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.graphics.StrokeData", ["definition", "lineWidth", "lineCap", "lineJoin", "miterLimit"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.graphics.TransformedObjectData", ["object", "transformation"]);
		ClassReference._createEncodingBaseObject("dbm.core.data.graphics.TransformationData", ["x", "y", "rotation", "scaleX", "scaleY"]);
	};
	
	staticFunctions._createEncodingBaseObject = function(aClassPath, aVariables) {
		var newEncoder = EncodingBaseObject.create();
		
		ClassReference._addEncodingObject(newEncoder, aClassPath, aVariables);
		
		return newEncoder;
	};
	
	staticFunctions._addEncodingObject = function(aEncoder, aClassPath, aVariables) {
		aEncoder.addVariablesToEncode(aVariables);
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder(aClassPath, aEncoder);
		
		return aEncoder;
	}
});