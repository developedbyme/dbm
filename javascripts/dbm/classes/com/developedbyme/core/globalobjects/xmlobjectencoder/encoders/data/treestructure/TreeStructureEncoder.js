/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder");
	
	//Self reference
	var TreeStructureEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureEncoder::_encodeValue");
		
		aNode.type = "complexValue";
		aNode.nodeValue = new Array();
		
		this.superCall(aValue, aNode);
		
		var newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aValue.getRoot(), aNode);
		newNode.parentApplyType = "treeStructure/root";
	};
	
	staticFunctions.create = function() {
		var newTreeStructureEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newTreeStructureEncoder;
	};
});