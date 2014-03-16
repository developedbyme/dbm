/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.tools.generic.GenericClickTool", "com.developedbyme.workspace.gui.tools.BaseTool", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.tools.generic.GenericClickTool");
	//"use strict";
	
	var GenericClickTool = dbm.importClass("com.developedbyme.workspace.gui.tools.generic.GenericClickTool");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.tools.generic.GenericClickTool::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.startTouch = function(aWorkspace, aSelection) {
		console.log("com.developedbyme.workspace.gui.tools.generic.GenericClickTool::startTouch");
		
		//METODO
		
		return false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var baseTool = (new ClassReference()).init();
		
		return baseTool;
		
	};
});