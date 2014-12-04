/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.switchablearea.InDomSwitchableArea", "dbm.gui.abstract.switchablearea.SwitchableAreaBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var InDomSwitchableArea = dbm.importClass("dbm.gui.abstract.switchablearea.InDomSwitchableArea");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var ConditionNode = dbm.importClass("dbm.flow.nodes.logic.ConditionNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.switchablearea.InDomSwitchableArea::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupAreaFlow = function(aName, aDisplayObject, aAreaData) {
		//console.log("dbm.gui.abstract.switchablearea.InDomSwitchableArea::_setupAreaFlow");
		var conditionNode = ConditionNode.create("===", this._visibleArea, aName);
		aDisplayObject.setPropertyInput("inDom", conditionNode.getProperty("outputValue"));
		
		aAreaData.addObject("nodes", new Array(conditionNode));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new InDomSwitchableArea()).init();
	};
});