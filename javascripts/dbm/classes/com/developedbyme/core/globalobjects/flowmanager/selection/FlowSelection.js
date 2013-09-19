dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.selection.FlowSelection", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.selection.FlowSelection");
	//"use strict";
	
	var FlowSelection = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.selection.FlowSelection");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var GroupSelectionResult = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.selection.FlowSelection::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.selectAllInputsForNode = function(aNode) {
		
		var currentArray = new Array(1);
		currentArray[0] = aNode;
		for(var i = 0; i < currentArray.length; i++) { //MENOTE: the array switches length
			var currentItem = currentArray[i];
			currentItem.fillWithAllInputConnections(currentItem, currentArray);
		}
		
		return currentArray;
	};
	
	staticFunctions.selectAllInputsForNodes = function(aNodes) {
		
		var currentArray = ArrayFunctions.copyArray(aNodes);
		for(var i = 0; i < currentArray.length; i++) { //MENOTE: the array switches length
			var currentItem = currentArray[i];
			currentItem.fillWithAllInputConnections(currentItem, currentArray);
		}
		
		return currentArray;
	};
	
	staticFunctions.selectNodesBetweenInputAndOutput = function(aInputNodes, aOutputNodes) {
		var groupSelectionResult = GroupSelectionResult.create();
		
		groupSelectionResult.inputNodes = ArrayFunctions.copyArray(aInputNodes);
		groupSelectionResult.outputNodes = ArrayFunctions.copyArray(aOutputNodes);
		
		//METODO
		
		return groupSelectionResult;
	};
});