dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	
	var WorkspaceCommandFunctions = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Workspace = dbm.importClass("com.developedbyme.workspace.gui.Workspace");
	var SizedElementAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.SizedElementAreaPart");
	var SplitLayoutAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	
	staticFunctions.createLayoutSplit = function(aWorkspace, aSplitType, aPercentageParameter, aOffset, aPath) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions::createLayoutSplit");
		//console.log(aWorkspace, aSplitType, aPercentageParameter, aOffset, aPath);
		
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
		
		aWorkspace.addPart(aPath, splitLayout);
	};
	
	staticFunctions.createSizedElementArea = function(aObject, aPath) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.commands.workspace.WorkspaceCommandFunctions::createSizedElementArea");
		
		var parentWorkspace = dbm.singletons.dbmHtmlDomManager.getParentControllerForHtmlElementByClass(aObject.getElement(), Workspace);
		if(parentWorkspace === null) {
			//METODO: error message
			return;
		}
		
		parentWorkspace.addPart(aPath, SizedElementAreaPart.create(aObject));
	};
});