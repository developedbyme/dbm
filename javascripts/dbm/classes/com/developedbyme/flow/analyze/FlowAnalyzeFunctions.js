dbm.registerClass("com.developedbyme.flow.analyze.FlowAnalyzeFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.analyze.FlowAnalyzeFunctions");
	//"use strict";
	
	var FlowAnalyzeFunctions = dbm.importClass("com.developedbyme.flow.analyze.FlowAnalyzeFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.getAllInputFlowForProperty = function(aProperty) {
		//console.log("com.developedbyme.flow.analyze.FlowAnalyzeFunctions::getAllInputFlowForProperty");
		var currentArray = new Array();
		aProperty.fillWithAllInputConnections(currentArray);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			currentConnection.fillWithAllInputConnections(currentArray);
		}
		
		return currentArray;
	};
	
	staticFunctions.getAllOutputFlowForProperty = function(aProperty) {
		//console.log("com.developedbyme.flow.analyze.FlowAnalyzeFunctions::getAllOutputFlowForProperty");
		var currentArray = new Array();
		aProperty.fillWithAllOutputConnections(currentArray);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			currentConnection.fillWithAllOutputConnections(currentArray);
		}
		
		return currentArray;
	};
	
	staticFunctions.getPropertyOutputHierarchyString = function(aConnection, aNumberOfSteps, aPrefix, aAddPrefix) {
		
		aNumberOfSteps = VariableAliases.valueWithDefault(aNumberOfSteps, 10);
		aPrefix = VariableAliases.valueWithDefault(aPrefix, "");
		aAddPrefix = VariableAliases.valueWithDefault(aAddPrefix, " ");
		
		var newNumberOfSteps = (aNumberOfSteps > 0) ? aNumberOfSteps-1 : aNumberOfSteps;
		var newPrefix = aPrefix + aAddPrefix;
		
		var returnString = aPrefix + aConnection.name;
		
		if(newNumberOfSteps !== 0) {
			var currentArray = new Array();
			aConnection.fillWithAllOutputConnections(currentArray);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentConnection = currentArray[i];
				
				returnString += "\n" + ClassReference.getPropertyOutputHierarchyString(currentConnection, newNumberOfSteps, newPrefix, aAddPrefix);
				
			}
		}
		
		return returnString;
	};
	
	staticFunctions.findConnectionBetweenProperties = function(aStartProperty, aEndProperty, aReturnArray) {
		//console.log("com.developedbyme.flow.analyze.FlowAnalyzeFunctions::findConnectionBetweenProperties");
		//console.log(aStartProperty.name, aEndProperty.name);
		if(aStartProperty === aEndProperty) {
			return aReturnArray.push(new Array(aEndProperty));
		}
		var returnArray = new Array();
		
		var currentArray = new Array();
		aStartProperty.fillWithAllOutputConnections(currentArray);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			var hasConnection = ClassReference.hasConnectionBetweenProperties(currentConnection, aEndProperty);
			if(hasConnection) {
				var baseArray = new Array(aStartProperty);
				var subArray = new Array();
				ClassReference.findConnectionBetweenProperties(currentConnection, aEndProperty, subArray);
				var currentArray2 = subArray;
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var newArray = baseArray.concat(currentArray2[j]);
					aReturnArray.push(newArray);
				}
			}
		}
	};
	
	staticFunctions.hasConnectionBetweenProperties = function(aStartProperty, aEndProperty) {
		
		if(aStartProperty === aEndProperty) {
			return true;
		}
		
		var currentArray = new Array();
		aStartProperty.fillWithAllOutputConnections(currentArray);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection === aEndProperty) {
				return true;
			}
			currentConnection.fillWithAllOutputConnections(currentArray);
		}
		return false;
	};
});