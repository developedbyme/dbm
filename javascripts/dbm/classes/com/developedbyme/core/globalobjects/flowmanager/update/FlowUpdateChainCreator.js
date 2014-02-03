dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	//"use strict";
	
	var FlowUpdateChainCreator = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	
	var FlowUpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChain");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	staticFunctions.createChainForConnection = function(aConnection, aInputConnection, aOutputConnection) {
		return FlowUpdateChain.create().setInputConnection(aInputConnection).setOutputConnection(aOutputConnection).addConnection(aConnection);
	};
	
	staticFunctions.createChainsForConnections = function(aConnections, aInputConnection, aOutputConnection, aOutputArray) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::createChainsForConnections");
		//console.log(aConnections, aOutputConnection, aOutputArray);
		
		var currentArray = aConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			aOutputArray.push(ClassReference.createChainForConnection(currentArray[i], aInputConnection, aOutputConnection));
		}
	};
	
	staticFunctions.doesInputAlreadyExistsInChainArray = function(aArray, aInputConnection, aEndNumber) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::doesInputAlreadyExistsInChainArray");
		
		var currentArrayLength = aArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			//console.log(aArray[i].inputConnection === aInputConnection, aArray[i].inputConnection, aInputConnection);
			if(aArray[i].inputConnection === aInputConnection) {
				return true;
			}
		}
		return false;
	};
	
	staticFunctions.doesOutputAlreadyExistsInChainArray = function(aArray, aOutputConnection, aEndNumber) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::doesOutputAlreadyExistsInChainArray");
		
		var currentArrayLength = aArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aArray[i].outputConnection === aOutputConnection) {
				return true;
			}
		}
		return false;
	};
	
	staticFunctions._removeChainFromUnsortedArray = function(aArray, aChain) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::_removeChainFromUnsortedArray");
		//console.log(aArray, aChain);
		
		var count = 0;
		
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChain = currentArray[i];
			
			if(currentChain === aChain) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
			else if(currentChain.outputConnection === aChain.outputConnection) {
				count++;
			}
		}
		
		return (aChain.outputConnection !== null) ? count : -1;
	};
	
	staticFunctions.createAllChainsForOutputConnection = function(aConnection) {
		var unsortedArray = new Array(1);
		unsortedArray[0] = ClassReference.createChainForConnection(aConnection, null, null);
		return ClassReference._createAllInputChains(unsortedArray);
	};
	
	staticFunctions.createAllChainsForMultipleOutputConnections = function(aConnections) {
		var unsortedArray = new Array();
		ClassReference.createChainsForConnections(aConnections, null, null, unsortedArray);
		return ClassReference._createAllInputChains(unsortedArray);
	};
	
	staticFunctions.createAllChainsForInputConnection = function(aConnection) {
		var unsortedArray = new Array(1);
		unsortedArray[0] = ClassReference.createChainForConnection(aConnection, null, null);
		return ClassReference._createAllOutputChains(unsortedArray);
	};
	
	staticFunctions._createAllInputChains = function(aStartChainsArray) {
		var sortedArray = new Array();
		var unsortedArray = aStartChainsArray;
		
		var currentArray = unsortedArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) { //MENOTE: the array switches length
			var currentChain = currentArray[i];
			var currentArray2 = currentChain.connections;
			var currentConnection = currentArray2[0];
			var debugCounter = 0;
			while(true) {
				if(debugCounter++ > 10000) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[FlowUpdateChainCreator]", "_createAllInputChains", "Loop has run for too long.");
					break;
				}
				var currentInputConnections = new Array();
				var currentOutputConnections = new Array();
				
				currentConnection.fillWithAllInputConnections(currentInputConnections);
				currentConnection.fillWithAllOutputConnections(currentOutputConnections);
				var currentInputConnectionsLength = currentInputConnections.length;
				
				if(currentInputConnectionsLength === 1 && currentOutputConnections.length < 2) {
					currentConnection = currentInputConnections[0];
					currentArray2.push(currentConnection);
					continue;
				}
				else if(currentInputConnectionsLength > 0) {
					currentChain.setInputConnection(currentConnection);
					if(!ClassReference.doesOutputAlreadyExistsInChainArray(currentArray, currentConnection)) {
						ClassReference.createChainsForConnections(currentInputConnections, null, currentConnection, currentArray);
						currentArrayLength = currentArray.length;
					}
				}
				else {
					sortedArray.push(currentChain);
				}
				break;
			}
		}
		
		ClassReference._sortChains(sortedArray, unsortedArray);
		
		return sortedArray;
	};
	
	staticFunctions._createAllOutputChains = function(aStartChainsArray) {
		var sortedArray = new Array();
		var unsortedArray = aStartChainsArray;
		
		var currentArray = unsortedArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			sortedArray.push(currentArray[i]);
		}
		for(var i = 0; i < currentArrayLength; i++) { //MENOTE: the array switches length
			var currentChain = currentArray[i];
			var currentArray2 = currentChain.connections;
			var currentConnection = currentArray2[0];
			if(currentChain.inputConnection !== null) {
				currentArray2.push(currentChain.inputConnection);
			}
			var debugCounter = 0;
			while(true) {
				//console.log("*********", currentConnection.name);
				if(debugCounter++ > 10000) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[FlowUpdateChainCreator]", "_createAllOutputChains", "Loop has run for too long.");
					break;
				}
				
				var currentInputConnections = new Array();
				var currentOutputConnections = new Array();
				
				currentConnection.fillWithAllInputConnections(currentInputConnections);
				currentConnection.fillWithAllOutputConnections(currentOutputConnections);
				var currentOutputConnectionsLength = currentOutputConnections.length;
				
				if(currentOutputConnectionsLength === 1 && currentInputConnections.length < 2) {
					currentConnection = currentOutputConnections[0];
					currentArray2.unshift(currentConnection);
					continue;
				}
				else if(currentOutputConnectionsLength > 0) {
					currentArray2.shift();
					currentChain.setOutputConnection(currentConnection);
					if(!ClassReference.doesInputAlreadyExistsInChainArray(currentArray, currentConnection)) {
						ClassReference.createChainsForConnections(currentOutputConnections, currentConnection, null, currentArray);
						currentArrayLength = currentArray.length;
					}
				}
				else {
					//MENOTE: do nothing
				}
				break;
			}
		}
		
		ClassReference._sortChains(sortedArray, unsortedArray);
		
		return sortedArray;
	};
	
	staticFunctions._sortChains = function(aSortedArray, aUnsortedArray) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::_sortChains");
		//console.log(aSortedArray, aUnsortedArray);
		
		var currentArray = aSortedArray;
		var currentArrayLength = aUnsortedArray.length; //MENOTE: that's right, take the length from the unsorted while working on the sorted
		var currentArray2 = aUnsortedArray;
		var currentArray2Length = aUnsortedArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var sortedChain = currentArray[i];
			var remainingOutputConnections = ClassReference._removeChainFromUnsortedArray(currentArray2, sortedChain);
			currentArray2Length--;
			if(sortedChain.outputConnection !== null) {
				if(remainingOutputConnections === 0) {
					for(var j = 0; j < currentArray2Length; j++) {
						var unsortedChain = currentArray2[j];
						if(unsortedChain.inputConnection === sortedChain.outputConnection) {
							currentArray.push(unsortedChain);
						}
					}
				}
			}
		}
	};
});