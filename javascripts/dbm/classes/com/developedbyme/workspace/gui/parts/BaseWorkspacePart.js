dbm.registerClass("com.developedbyme.workspace.gui.parts.BaseWorkspacePart", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.parts.BaseWorkspacePart");
	//"use strict";
	
	var BaseWorkspacePart = dbm.importClass("com.developedbyme.workspace.gui.parts.BaseWorkspacePart");
	
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.parts.BaseWorkspacePart::_init");
		
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
	
	//objectFunctions.addSubPart = function(aPart) {
	//	this._parts.push(aPart);
	//};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._treeStructureItem = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newBaseWorkspacePart = (new ClassReference()).init();
		
		return newBaseWorkspacePart;
		
	};
});