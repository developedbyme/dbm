/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Documentation meta data for a single documentation comment.
 */
dbm.registerClass("dbm.compiler.compiledata.documentation.DocumentedItem", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.compiledata.documentation.DocumentedItem");
	
	//Self reference
	var DocumentedItem = dbm.importClass("dbm.compiler.compiledata.documentation.DocumentedItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.compiledata.documentation.DocumentedItem::_init");
		
		this.superCall();
		
		this.type = null;
		this.documentation = null;
		this.definition = null;
		this.fullCode = null;
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @praam	aType	DocumentationTypes	The type of documentation.
	 * @param	aCode	String				The raw code that is being documented.
	 *
	 * @return	DocumentedItem	The newly created instance.
	 */
	staticFunctions.create = function(aType, aCode) {
		var newDocumentedItem = (new ClassReference()).init();
		newDocumentedItem.type = aType;
		newDocumentedItem.fullCode = aCode;
		
		return newDocumentedItem;
	};
});