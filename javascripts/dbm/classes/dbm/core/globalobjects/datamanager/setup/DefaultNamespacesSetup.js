/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.setup.DefaultNamespacesSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.setup.DefaultNamespacesSetup");
	
	var DefaultNamespacesSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultNamespacesSetup");
	
	staticFunctions.setup = function() {
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
	};
});