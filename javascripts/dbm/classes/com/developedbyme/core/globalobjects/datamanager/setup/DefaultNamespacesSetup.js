dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultNamespacesSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultNamespacesSetup");
	
	var DefaultNamespacesSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultNamespacesSetup");
	
	staticFunctions.setup = function() {
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
	};
});