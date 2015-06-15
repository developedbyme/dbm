/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder");
	
	//Self reference
	var TreeStructureItemEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.treestructure.TreeStructureItemEncoder::_encodeValue");
		
		aNode.type = "complexValue";
		aNode.nodeValue = new Array();
		
		this.superCall(aValue, aNode);
		
		var attributes = aValue._internalFunctionality_getAttributes();
		if(attributes !== null) {
			var currentArray = attributes.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentName = currentArray[i];
				var currentObject = attributes.getObject(currentName);
			
				var newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(currentObject, aNode);
				newNode.name = currentName;
				newNode.parentApplyType = "treeStructure/setAttribute";
			}
		}
		
		var currentArray = aValue.getChildNames();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentObject = aValue.getChildByName(currentName);
		
			var newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(currentObject, aNode);
			newNode.name = currentName;
			newNode.parentApplyType = "treeStructure/addChild";
		}
	};
	
	staticFunctions.create = function() {
		var newTreeStructureItemEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newTreeStructureItemEncoder;
	};
});