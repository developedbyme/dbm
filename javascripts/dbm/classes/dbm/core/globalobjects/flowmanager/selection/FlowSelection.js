/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.flowmanager.selection.FlowSelection", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.flowmanager.selection.FlowSelection");
	//"use strict";
	
	var FlowSelection = dbm.importClass("dbm.core.globalobjects.flowmanager.selection.FlowSelection");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var GroupSelectionResult = dbm.importClass("dbm.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("dbm.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.flowmanager.selection.FlowSelection::_init");
		
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