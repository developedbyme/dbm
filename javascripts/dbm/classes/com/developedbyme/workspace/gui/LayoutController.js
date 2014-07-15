/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.LayoutController", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.LayoutController");
	//"use strict";
	
	//Self reference
	var LayoutController = dbm.importClass("com.developedbyme.workspace.gui.LayoutController");
	
	//Error report
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.LayoutController::_init");
		
		this.superCall();
		
		this._parts = this.addDestroyableObject(TreeStructure.create());
		this._parts.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._newTreeStructureAdded, [GetVariableObject.createSelectDataCommand()]));
		
		this._newTreeStructureAdded(this._parts.getRoot());
		this._parts.getRoot().getAttribute("properties").setPropertyInput("inputArea", Rectangle.create(0, 0, 100, 100));
		
		return this;
	};
	
	objectFunctions.getTreeStructure = function() {
		return this._parts;
	};
	
	objectFunctions.addPart = function(aPath, aPart) {
		//console.log("com.developedbyme.workspace.gui.LayoutController::addPart");
		
		var treeStructureItem = this._parts.getItemByPath(aPath);
		aPart.setTreeStructureItem(treeStructureItem);
	};
	
	objectFunctions._newTreeStructureAdded = function(aTreeStructureItem) {
		//console.log("com.developedbyme.workspace.gui.LayoutController::_newTreeStructureAdded");
		//console.log(aTreeStructureItem);
		
		var propertiesHolder = PropertiesHolder.create();
		aTreeStructureItem.setAttribute("properties", propertiesHolder);
		propertiesHolder.createProperty("inputArea", null).setAlwaysUpdateFlow();
		propertiesHolder.createProperty("defaultChildArea", null).setAlwaysUpdateFlow();
		propertiesHolder.createProperty("parent", null);
		propertiesHolder.createProperty("defaultChildParent", null);
		
		propertiesHolder.setPropertyInput("defaultChildParent", propertiesHolder.getProperty("parent"));
		propertiesHolder.setPropertyInput("defaultChildArea", propertiesHolder.getProperty("inputArea"));
		
		var theParent = aTreeStructureItem.getParent();
		if(theParent !== null) {
			var parentPropertiesHolder = theParent.getAttribute("properties");
			propertiesHolder.setPropertyInput("parent", parentPropertiesHolder.getProperty("defaultChildParent"));
			propertiesHolder.setPropertyInput("inputArea", parentPropertiesHolder.getProperty("defaultChildArea"));
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parts = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new ClassReference()).init();
	};
});