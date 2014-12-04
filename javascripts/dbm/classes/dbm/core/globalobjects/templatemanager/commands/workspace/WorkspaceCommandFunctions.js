/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	
	//Self reference
	var WorkspaceCommandFunctions = dbm.importClass("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var Workspace = dbm.importClass("dbm.workspace.gui.Workspace");
	var SizedElementAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.SizedElementAreaPart");
	var SplitLayoutAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var LayoutController = dbm.importClass("dbm.workspace.gui.LayoutController");
	var BaseWorkspacePart = dbm.importClass("dbm.workspace.gui.parts.BaseWorkspacePart");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.createLayoutSplit = function(aWorkspace, aSplitType, aPercentageParameter, aOffset, aPath) {
		//console.log("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions::createLayoutSplit");
		//console.log(aWorkspace, aSplitType, aPercentageParameter, aOffset, aPath);
		
		var parentController = dbm.singletons.dbmHtmlDomManager.getParentControllerThatHasDynamicVariable(aWorkspace.getElement(), "layoutArea");
		var layoutArea = parentController.getDynamicVariable("layoutArea");
		
		var splitLayout = SplitLayoutAreaPart.create();
		switch(aSplitType) {
			case "horizontal":
			case "h":
				splitLayout.setupHorizontalSplit();
				break;
			case "vertical":
			case "v":
				splitLayout.setupVerticalSplit();
				break;
			default:
				//METODO: error message
				break;
		}
		
		splitLayout.setPropertyInput("splitPosition", aPercentageParameter);
		splitLayout.setPropertyInput("splitOffset", aOffset);
		
		layoutArea.addPart(aPath, splitLayout);
	};
	
	staticFunctions.createSizedElementArea = function(aObject, aPath) {
		//console.log("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions::createSizedElementArea");
		
		var parentController = dbm.singletons.dbmHtmlDomManager.getParentControllerThatHasDynamicVariable(aObject.getElement(), "layoutArea");
		
		if(parentController === null) {
			//METODO: error message
			return;
		}
		
		var layoutArea = parentController.getDynamicVariable("layoutArea");
		
		var newArea = SizedElementAreaPart.create(aObject);
		aObject.setDynamicVariable("layoutArea", newArea);
		layoutArea.addPart(aPath, newArea);
	};
	
	staticFunctions.addLayoutController = function(aObject) {
		console.log("dbm.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions::addLayoutController");
		console.log(aObject);
		
		var layoutController = aObject.addDestroyableObject(LayoutController.create());
		var layoutArea = aObject.addDestroyableObject(BaseWorkspacePart.create());
		var rootNode = layoutController.getTreeStructure().getRoot();
		layoutArea.setTreeStructureItem(rootNode);
		
		rootNode.getAttribute("properties").setPropertyInput("parent", aObject.getProperty("element"));
		
		aObject.setDynamicVariable("layoutController", layoutController);
		aObject.setDynamicVariable("layoutArea", layoutArea);
		
	};
	
	staticFunctions.setSizeAsInputArea = function(aObject) {
		var sizeNode = aObject.addDestroyableObject(SizeOfElementNode.create(aObject.getProperty("element"), aObject.getProperty("inDomOutput")));
		sizeNode.checkForLayoutChange();
		var createRectangleNode = aObject.addDestroyableObject(RectangleFromValuesNode.create(0, 0, sizeNode.getProperty("width"), sizeNode.getProperty("height")));
		
		var layoutArea = aObject.getDynamicVariable("layoutArea");
		layoutArea.getTreeStructureItem().getAttribute("properties").setPropertyInput("inputArea", createRectangleNode.getProperty("outputRectangle"));
	};
});