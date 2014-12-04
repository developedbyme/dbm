/**
 * An id group that combines a prefix, number, and suffix to an id.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.idmanager.objects.NormalIdGroup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.idmanager.objects.NormalIdGroup");
	
	var NormalIdGroup = dbm.importClass("dbm.core.globalobjects.idmanager.objects.NormalIdGroup");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.idmanager.objects.NormalIdGroup");
		
		this.superCall();
		
		this.prefix = "";
		this.suffix = "";
		this._idNumber = 0;
		
		return this;
	};
	
	objectFunctions.getId = function(aNumber) {
		return (this.prefix + aNumber + this.suffix);
	};
	
	/**
	 * Returns a new id as a string.
	 *
	 * @return	The id as a string.
	 */
	objectFunctions.getNewId = function() {
		var returnId = this._idNumber;
		this._idNumber++;
		return this.getId(returnId);
	};
	
	/**
	 * Return a new id as a number.
	 *
	 * @return	The number part for the id.
	 */
	objectFunctions.getNewIdNumber = function() {
		var returnId = this._idNumber;
		this._idNumber++;
		return returnId;
	};
	
	staticFunctions.create = function(aPrefix, aSuffix) {
		var newNormalIdGroup = (new ClassReference()).init();
		newNormalIdGroup.prefix = VariableAliases.valueWithDefault(aPrefix, "");
		newNormalIdGroup.suffix = VariableAliases.valueWithDefault(aSuffix, "");
		return newNormalIdGroup;
	};
});