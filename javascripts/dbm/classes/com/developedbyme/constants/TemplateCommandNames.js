dbm.registerClass("com.developedbyme.constants.TemplateCommandNames", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.TemplateCommandNames");
	
	var TemplateCommandNames = dbm.importClass("com.developedbyme.constants.TemplateCommandNames");
	
	staticFunctions.POSITIONED = "positioned";
	staticFunctions.SIZED = "sized";
	staticFunctions.TRANSFORMED = "transformed";
	
	staticFunctions.ALPHA_ENABLED = "alphaEnabled";
	staticFunctions.Z_INDEX_ENABLED = "zIndexEnabled";
	staticFunctions.UPDATE_DISPLAY = "updateDisplay";
	
	//Flow
	staticFunctions.CONNECT_INPUT = "flow:connectInput";
	staticFunctions.CONNECT_OUTPUT = "flow:connectOutput";
	staticFunctions.UPDATE_FLOW = "flow:update";
	staticFunctions.START_UPDATING_FLOW = "flow:startUpdating";
	
	//Workspace
	staticFunctions.ELEMENT_SIZE_AS_AREA = "workspace:elementSizeAsArea";
	staticFunctions.LAYOUT_SPLIT = "workspace:layoutSplit";
	staticFunctions.SIZED_ELEMENT_AREA = "workspace:sizedElementArea";
});