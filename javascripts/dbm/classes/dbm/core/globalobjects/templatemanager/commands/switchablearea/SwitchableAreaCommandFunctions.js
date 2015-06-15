/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	//Self reference
	var SwitchableAreaCommandFunctions = dbm.importClass("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var InDomSwitchableArea = dbm.importClass("dbm.gui.abstract.switchablearea.InDomSwitchableArea");
	var SwitchableAreaHolder = dbm.importClass("dbm.gui.abstract.switchablearea.SwitchableAreaHolder");
	var BooleanSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.BooleanSwitchedNode");
	
	//Utils
	
	//Constants
	
	staticFunctions.createInDomSwitchableArea = function(aHolder) {
		console.log("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions::visibleAreaFromBooleanProperty");
		console.log(aHolder);
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
	
	staticFunctions.visibleAreaFromBooleanProperty = function(aHolder, aProperty, aTrueValue, aFalseValue) {
		console.log("dbm.core.globalobjects.templatemanager.commands.switchablearea.SwitchableAreaCommandFunctions::visibleAreaFromBooleanProperty");
		console.log(aHolder, aProperty, aTrueValue, aFalseValue);
		var switchableArea = aHolder.getSwitchableArea();
		
		var switchNode = switchableArea.addDestroyableObject(BooleanSwitchedNode.create(aProperty, aTrueValue, aFalseValue));
		switchableArea.setPropertyInput("visibleArea", switchNode.getProperty("outputValue"));
	};
});