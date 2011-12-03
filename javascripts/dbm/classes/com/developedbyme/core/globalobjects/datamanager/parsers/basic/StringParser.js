dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var StringParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var ParseStringNode = dbm.importClass("com.developedbyme.flow.nodes.parse.ParseStringNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseObject = function(aDataObject) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser::parseObject");
		var definitionXml = aDataObject.getDefinitionXml();
		
		var nodeValue = dbm.singletons.dbmDataManager.getNodeValue(definitionXml);
		if(nodeValue != null) {
			aDataObject.getProperty("data").setValue(nodeValue);
		}
		else {
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			var firstChild = XmlChildRetreiver.getNamespacedChild(definitionXml, dataNamespace, "item");
			var childName = XmlChildRetreiver.getNamespacedAttribute(firstChild, dataNamespace, "name");
			if(childName == null) {
				childName = "default";
			}
			var childPath = aDataObject.getHierarchyItem().getPath() + "/" + childName;
			var inputProperty = dbm.singletons.dbmDataManager.getDataProperty(childPath);
			var parseNode = ParseStringNode.create(inputProperty);
			aDataObject.addNode(parseNode);
			aDataObject.setPropertyInput("data", parseNode.getProperty("outputValue"));
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newStringParser = (new ClassReference()).init();
		return newStringParser;
	};
});