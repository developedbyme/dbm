/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.PointsArrayParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.PointsArrayParser");
	
	//Self reference
	var PointsArrayParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.PointsArrayParser");
	
	//Error report
	
	//Dependencies
	var ParseFloatNode = dbm.importClass("com.developedbyme.flow.nodes.parse.ParseFloatNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.PointsArrayParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		//METODO
		//var parseNode = ParseFloatNode.create(aInputProperty);
		//return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
		return null; //MEDEBUG
	};
	
	objectFunctions._createResult = function(aValue) {
		//METODO: need to break out point generation to a function
		return ParserResultDataObject.create(dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, false, aValue).pointsArray);
	};
	
	staticFunctions.create = function() {
		var newPointsArrayParser = (new ClassReference()).init();
		return newPointsArrayParser;
	};
});