dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var TextReplacementParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var ToLowerCaseNode = dbm.importClass("com.developedbyme.flow.nodes.text.ToLowerCaseNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseObject = function(aDataObject) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::parseObject");
		var definitionXml = aDataObject.getDefinitionXml();
		
		var nodeValue = dbm.singletons.dbmDataManager.getNodeValue(definitionXml);
		if(nodeValue != null) {
			aDataObject.getProperty("data").setValue(nodeValue.toString().toLowerCase());
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
			var parseNode = ToLowerCaseNode.create(inputProperty);
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
		var newTextReplacementParser = (new ClassReference()).init();
		return newTextReplacementParser;
	};
});