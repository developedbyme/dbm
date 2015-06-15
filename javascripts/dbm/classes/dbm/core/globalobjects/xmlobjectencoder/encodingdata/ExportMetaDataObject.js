/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject", "dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	
	//Self reference
	var ExportMetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject::_init");
		
		this.superCall();
		
		this.namespaces = NamedArray.create(false);
		
		return this;
	};
	
	staticFunctions.create = function() {
		var newExportMetaDataObject = ClassReference._createAndInitClass(ClassReference);
		
		return newExportMetaDataObject;
	};
});