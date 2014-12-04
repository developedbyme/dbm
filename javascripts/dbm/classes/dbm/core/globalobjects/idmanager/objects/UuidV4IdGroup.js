/**
 * An id group that generates a v4 uuid.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup");
	
	//Self reference
	var UuidV4IdGroup = dbm.importClass("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup");
		
		this.superCall();
		
		this._uuidGenerator = null;
		
		return this;
	};
	
	objectFunctions.setGenerator = function(aGenerator) {
		this._uuidGenerator = aGenerator;
		
		return this;
	};
	
	/**
	 * Returns a new id as a string.
	 *
	 * @return	The id as a string.
	 */
	objectFunctions.getNewId = function() {
		return this._uuidGenerator.generateV4();
	};
	
	staticFunctions.create = function(aUuidGenerator) {
		var newUuidV4IdGroup = (new ClassReference()).init();
		newUuidV4IdGroup.setGenerator(aUuidGenerator);
		return newUuidV4IdGroup;
	};
});