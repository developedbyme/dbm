dbm.registerClass("com.developedbyme.constants.TemplateCommandNames", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.TemplateCommandNames");
	
	var TemplateCommandNames = dbm.importClass("com.developedbyme.constants.TemplateCommandNames");
	
	staticFunctions.IGNORE = "ignore";
	
	staticFunctions.POSITIONED = "positioned";
	staticFunctions.SIZED = "sized";
	staticFunctions.TRANSFORMED = "transformed";
	
	staticFunctions.ALPHA_ENABLED = "alphaEnabled";
	staticFunctions.Z_INDEX_ENABLED = "zIndexEnabled";
	staticFunctions.UPDATE_DISPLAY = "updateDisplay";
	staticFunctions.ACTIVATE = "activate";
	
	//Dynamic data
	staticFunctions.ADD_DYNAMIC_OBJECT = "dynamic:add";
	staticFunctions.ADD_DYNAMIC_PROPERTY = "dynamic:addProperty";
	
	//Flow
	staticFunctions.CONNECT_INPUT = "flow:connectInput";
	staticFunctions.CONNECT_OUTPUT = "flow:connectOutput";
	staticFunctions.UPDATE_FLOW = "flow:update";
	staticFunctions.START_UPDATING_FLOW = "flow:startUpdating";
	
	//Workspace
	staticFunctions.ELEMENT_SIZE_AS_AREA = "workspace:elementSizeAsArea";
	staticFunctions.LAYOUT_SPLIT = "workspace:layoutSplit";
	staticFunctions.SIZED_ELEMENT_AREA = "workspace:sizedElementArea";
	
	//Slider
	staticFunctions.SCALE_FIRST_CHILD = "slider:scaleFirstChild";
	
	//State
	staticFunctions.ADD_STATE_IMAGE = "state:addImage";
	
	//Switchable area
	staticFunctions.CREATE_IN_DOM_SWITCHABLE_AREA = "switchable:createInDomSwitch";
	staticFunctions.ADD_SWITCHABLE_AREA = "switchable:addArea";
});