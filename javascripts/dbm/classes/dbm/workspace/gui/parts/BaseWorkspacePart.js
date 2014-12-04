/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.parts.BaseWorkspacePart", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.parts.BaseWorkspacePart");
	//"use strict";
	
	//Self reference
	var BaseWorkspacePart = dbm.importClass("dbm.workspace.gui.parts.BaseWorkspacePart");
	
	//Error report
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.parts.BaseWorkspacePart::_init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		return this;
	};
	
	objectFunctions.setTreeStructureItem = function(aTreeStructureItem) {
		this._treeStructureItem = aTreeStructureItem;
		this._treeStructureItem.retain();
		this.addDestroyableObject(this._treeStructureItem);
		
		this._treeStructureItem.data = this;
		
		this._setupHierarchy();
		
		return this;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
	};
	
	objectFunctions._setupHierarchy = function() {
		//MENOTE: should be overridden
	};
	
	objectFunctions.addPart = function(aPath, aPart) {
		//console.log("dbm.workspace.gui.parts.BaseWorkspacePart::addPart");
		//console.log(aPath, aPart);
		var treeStructureItem = this._treeStructureItem.getRoot().getItemByPath(aPath, this._treeStructureItem);
		aPart.setTreeStructureItem(treeStructureItem);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._treeStructureItem = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newBaseWorkspacePart = (new ClassReference()).init();
		
		return newBaseWorkspacePart;
		
	};
});