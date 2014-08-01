/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject", "com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	
	//Self reference
	var ExportMetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject::_init");
		
		this.superCall();
		
		this.namespaces = NamedArray.create(false);
		
		return this;
	};
	
	staticFunctions.create = function() {
		var newExportMetaDataObject = ClassReference._createAndInitClass(ClassReference);
		
		return newExportMetaDataObject;
	};
});