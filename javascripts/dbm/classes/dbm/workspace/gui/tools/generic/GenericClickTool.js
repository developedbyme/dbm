/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.tools.generic.GenericClickTool", "dbm.workspace.gui.tools.BaseTool", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.tools.generic.GenericClickTool");
	//"use strict";
	
	var GenericClickTool = dbm.importClass("dbm.workspace.gui.tools.generic.GenericClickTool");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.tools.generic.GenericClickTool::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.startTouch = function(aWorkspace, aSelection) {
		console.log("dbm.workspace.gui.tools.generic.GenericClickTool::startTouch");
		
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