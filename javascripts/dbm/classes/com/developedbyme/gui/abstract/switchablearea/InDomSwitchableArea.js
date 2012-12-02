dbm.registerClass("com.developedbyme.gui.abstract.switchablearea.InDomSwitchableArea", "com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var InDomSwitchableArea = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.InDomSwitchableArea");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.switchablearea.InDomSwitchableArea::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupAreaFlow = function(aName, aDisplayObject, aAreaData) {
		var conditionNode = ConditionNode.create("===", this._selectedArea, aName);
		aDisplayObject.setPropertyInput("inDom", conditionNode.getProperty("outputValue"));
		
		areaData.addObject("nodes", new Array(conditionNode));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new InDomSwitchableArea()).init();
	};
});