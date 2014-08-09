/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data encoder for a gradient.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder");
	
	//Self reference
	var GradientEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Encodes the value.
	 *
	 * @param	aValue	Any					The value to encode.
	 * @param	aNode	EncodingDataObject	Encoding data where child properties will be added.
	 */
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var partsNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aValue.getColorStops(), aNode);
		partsNode.name = "colorStops";
		partsNode.parentApplyType = "gradient/addColorStops";
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @return	GradientEncoder	The newly created object.
	 */
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.graphics.gradient.GradientEncoder::create");
		var newGradientEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newGradientEncoder;
	};
});