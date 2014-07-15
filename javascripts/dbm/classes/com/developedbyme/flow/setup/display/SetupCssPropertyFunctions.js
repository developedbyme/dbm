/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.setup.display.SetupCssPropertyFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.setup.display.SetupCssPropertyFunctions");
	//"use strict";
	
	//Self reference
	var SetupCssPropertyFunctions = dbm.importClass("com.developedbyme.flow.setup.display.SetupCssPropertyFunctions");
	
	//Error report
	
	//Dependencies
	var PrefixSuffixStringNode = dbm.importClass("com.developedbyme.flow.nodes.text.PrefixSuffixStringNode");
	var CachedValueNode = dbm.importClass("com.developedbyme.flow.nodes.data.CachedValueNode");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	staticFunctions.setupBackgroundImageProperty = function(aDisplayObject, aInputValue) {
		
		var inputProperty = aDisplayObject.createProperty("backgroundImage", aInputValue);
		var urlNode = PrefixSuffixStringNode.create("url(\"", inputProperty, "\")");
		aDisplayObject.addDestroyableObject(urlNode);
		var outputProperty = aDisplayObject.createCssProperty("urlBackgroundImage", "background-image", UnitTypes.NONE, null);
		outputProperty.connectInput(urlNode.getProperty("outputValue"));
	};
	
	staticFunctions.setupBackgroundImagePropertyWithCache = function(aDisplayObject, aInputValue) {
		
		var inputProperty = aDisplayObject.createProperty("backgroundImage", aInputValue);
		var urlNode = PrefixSuffixStringNode.create("url(\"", inputProperty, "\")");
		aDisplayObject.addDestroyableObject(urlNode);
		var outputProperty = aDisplayObject.createCssProperty("urlBackgroundImage", "background-image", UnitTypes.NONE, null);
		
		var cacheNode = CachedValueNode.create(urlNode.getProperty("outputValue"));
		aDisplayObject.addDestroyableObject(cacheNode);
		var cacheOutputNode = PrefixSuffixStringNode.create(urlNode.getProperty("outputValue"), ", ", cacheNode.getProperty("outputValue"));
		aDisplayObject.addDestroyableObject(cacheOutputNode);
		
		outputProperty.connectInput(cacheOutputNode.getProperty("outputValue"));
	};
});
