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
	
	staticFunctions.createChainForConnection = function(aConnection, aOutputConnection) {
		return FlowUpdateChain.create().setOutputConnection(aOutputConnection).addConnection(aConnection);
	};
	
	staticFunctions.createChainsForConnections = function(aConnections, aOutputConnection, aOutputArray) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::createChainsForConnections");
		//console.log(aConnections, aOutputConnection, aOutputArray);
		
		var currentArray = aConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			aOutputArray.push(ClassReference.createChainForConnection(currentArray[i], aOutputConnection));
		}
	};
	
	staticFunctions.doesOutputAlreadyExistsInChainArray = function(aArray, aOutputConnection, aEndNumber) {
		for(var i = 0; i < aEndNumber; i++) {
			if(aArray[i].outputConnection === aOutputConnection) {
				return true;
			}
		}
		return false;
	};
	
	staticFunctions._removeChainFromUnsortedArray = function(aArray, aChain) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator::_removeChainFromUnsortedArray");
		
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
		
		return count;
	};
	
	staticFunctions.createAllChainsForOutputConnection = function(aConnection) {
		
		var sortedArray = new Array();
		var unsortedArray = new Array(1);
		unsortedArray[0] = ClassReference.createChainForConnection(aConnection, null);
		
		var currentArray = unsortedArray;
		for(var i = 0; i < currentArray.length; i++) { //MENOTE: the array switches length
			var currentChain = currentArray[i];
			var currentArray2 = currentChain.connections;
			var currentConnection = currentArray2[0];
			var debugCounter = 0;
			while(true) {
				if(debugCounter++ > 10000) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[FlowUpdateChainCreator]", "createAllChainsForOutputConnection", "Loop has run for too long.");
					break;
				}
				var currentInputConnections = new Array();
				currentConnection.fillWithAllInputConnections(currentInputConnections);
				var currentInputConnectionsLength = currentInputConnections.length;
				if(currentInputConnectionsLength === 1) {
					
					var currentOutputConnections = new Array();
					currentInputConnections[0].fillWithAllOutputConnections(currentOutputConnections);
					if(currentOutputConnections.length > 1) {
						currentChain.setInputConnection(currentConnection);
						if(!ClassReference.doesOutputAlreadyExistsInChainArray(currentArray, currentConnection, i)) {
							currentArray.push(ClassReference.createChainForConnection(currentInputConnections[0], currentConnection));
						}
					}
					else {
						currentConnection = currentInputConnections[0];
						currentArray2.push(currentConnection);
						continue;
					}
				}
				else if(currentInputConnectionsLength > 1) {
					currentChain.setInputConnection(currentConnection);
					if(!ClassReference.doesOutputAlreadyExistsInChainArray(currentArray, currentConnection, i)) {
						ClassReference.createChainsForConnections(currentInputConnections, currentConnection, currentArray);
					}
				}
				else {
					sortedArray.push(currentChain);
				}
				break;
			}
		}
		
		var currentArray = sortedArray;
		var currentArrayLength = unsortedArray.length; //MENOTE: that's right, take the length from the unsorted while working on the sorted
		var currentArray2 = unsortedArray;
		var currentArray2Length = unsortedArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var sortedChain = currentArray[i];
			var remainingOutputConnections = ClassReference._removeChainFromUnsortedArray(currentArray2, sortedChain);
			currentArray2Length--;
			if(remainingOutputConnections === 0) {
				for(var j = 0; j < currentArray2Length; j++) {
					var unsortedChain = currentArray2[j];
					if(unsortedChain.inputConnection === sortedChain.outputConnection) {
						currentArray.push(unsortedChain);
					}
				}
			}
		}
		
		return sortedArray;
	};
});