/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.tools.BaseTool", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.tools.BaseTool");
	//"use strict";
	
	var BaseTool = dbm.importClass("com.developedbyme.workspace.gui.tools.BaseTool");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.tools.BaseTool::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.startTouch = function(aWorkspace, aSelection) {
		
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