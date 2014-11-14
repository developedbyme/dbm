/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject");
	//"use strict";
	
	//Self reference
	var AfterEffectsProject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var ItemBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.ItemBaseObject");
	var CompositionItem = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::_init");
		
		this.superCall();
		
		this._nativeProject = null;
		this._items = null;
		this._activeItem = null;
		
		return this;
	};
	
	objectFunctions.setNativeProject = function(aNativeProject) {
		this._nativeProject = aNativeProject;
		
		return this;
	};
	
	objectFunctions.setupItems = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::setupItems");
		var treeStructure = TreeStructure.create();
		this._items = this.addDestroyableObject(treeStructure);
		
		var currentItem = this._items.getRoot();
		var currentFolder = this._nativeProject.rootFolder;
		this._createItem(currentFolder, currentItem);
		this._setupItemsInFolder(currentFolder, currentItem);
		
		//console.log("//com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::setupItems");
		return this;
	};
	
	objectFunctions._setupItemsInFolder = function(aFolder, aTreeStructureItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::_setupItemsInFolder");
		//console.log(aFolder, aTreeStructureItem);
		
		var numberOfItems = aFolder.numItems;
		for(var i = 1; i <= numberOfItems; i++) { //MENOTE: count starts at 1
			var currentItem = aFolder.item(i);
			var encodedName = encodeURIComponent(currentItem.name);
			var newTreeStructureItem = this._items.getItemByPath(encodedName, aTreeStructureItem);
			
			if(this._nativeProject.activeItem === currentItem) {
				if(this._activeItem === null) {
					var currentRealItem = this._createItem(currentItem, newTreeStructureItem);
					this._activeItem = currentRealItem;
				}
				else {
					newTreeStructureItem.data = this._activeItem;
				}
			}
			else {
				this._createItem(currentItem, newTreeStructureItem);
			}
			
			if(currentItem instanceof FolderItem) {
				this._setupItemsInFolder(currentItem, newTreeStructureItem);
			}
		}
	};
	
	objectFunctions._createItem = function(aNativeItem, aTreeStructureItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::_createItem");
		//console.log(aNativeItem, aTreeStructureItem);
		
		var newItem;
		
		if(aNativeItem instanceof CompItem) {
			newItem = CompositionItem.create(aNativeItem);
		}
		else {
			newItem = ItemBaseObject.create(aNativeItem);
		}
		
		if(VariableAliases.isSet(aTreeStructureItem)) {
			aTreeStructureItem.data = newItem;
		}
		
		//console.log("//com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::_createItem");
		return newItem;
	};
	
	objectFunctions.getActiveItem = function() {
		if(this._activeItem === null) {
			this._activeItem = this._createItem(this._nativeProject.activeItem);
		}
		
		return this._activeItem;
	};
	
	objectFunctions.getItemByNativeItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::getItemByNativeItem");
		
		return this._getItemByNativeItemRecursive(this._items.getRoot().getChildren(), aNativeItem);
	};
	
	objectFunctions._getItemByNativeItemRecursive = function(aTreeStructureItems, aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::_getItemByNativeItemRecursive");
		
		var currentArray = aTreeStructureItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[i];
			var currentItem = currentTreeStructureItem.data;
			if(currentItem.getNativeItem() === aNativeItem) {
				return currentItem;
			}
			
			var childResult = this._getItemByNativeItemRecursive(currentTreeStructureItem.getChildren(), aNativeItem);
			if(childResult !== null) {
				return childResult;
			}
		}
		
		return null;
	};
	
	objectFunctions.deselectAllItems = function() {
		var currentArray = ArrayFunctions.copyArray(this._nativeProject.selection);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i].selected = false;
		}
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeProject = null;
		this._items = null;
		
		this.superCall();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		/*
		switch(aName) {
			case "":
				return true;
		}
		*/
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.AfterEffectsProject::create");
		
		var newAfterEffectsProject = (new ClassReference()).init();
		
		newAfterEffectsProject.setNativeProject(app.project);
		newAfterEffectsProject.setupItems();
		
		return newAfterEffectsProject;
	};
});