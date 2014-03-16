/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	//Self reference
	var SwitchableAreaCommandFunctions = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var InDomSwitchableArea = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.InDomSwitchableArea");
	var SwitchableAreaHolder = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaHolder");
	
	//Utils
	
	//Constants
	
	staticFunctions.createInDomSwitchableArea = function(aHolder) {
		var newInDomSwitchableArea = InDomSwitchableArea.create();
		
		aHolder.setSwitchableArea(newInDomSwitchableArea);
	};
	
	staticFunctions.addArea = function(aObject, aName, aOwnsObject) {
		var parentAreaHolder = dbm.singletons.dbmHtmlDomManager.getParentControllerForHtmlElementByClass(aObject.getElement(), SwitchableAreaHolder);
		
		if(parentAreaHolder === null) {
			//METODO: error report
			return null;
		}
		
		parentAreaHolder.getSwitchableArea().addArea(aName, aObject, aOwnsObject);
	};
});