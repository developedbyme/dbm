/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.setup.workspace.SetupErrorReportFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.setup.workspace.SetupErrorReportFunctions");
	//"use strict";
	
	var SetupErrorReportFunctions = dbm.importClass("com.developedbyme.flow.setup.workspace.SetupErrorReportFunctions");
	
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var RoundToNumberOfDecimalsNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions._setupErrorReportCounter = function(aCounter, aText) {
		
		var conditionNode = ConditionNode.create("<", aCounter, 1000);
		var divisionNode = DivisionNode.create(aCounter, 1000);
		
		var roundNode = RoundToNumberOfDecimalsNode.create(divisionNode.getProperty("outputValue"), 1);
		
		var stringCombinerNode = AdditionNode.create(roundNode.getProperty("outputValue"), "k");
		
		var switchNode = BooleanSwitchedNode.create(conditionNode.getProperty("outputValue"), aCounter, stringCombinerNode.getProperty("outputValue"));
		
		aText.setPropertyInput("text", switchNode.getProperty("outputValue"));
	};
	
	staticFunctions.setupErrorReportCounters = function(aErrorReportHandler, aErrorsText, aWarningsText, aLogsText) {
		ClassReference._setupErrorReportCounter(aErrorReportHandler.getProperty("numberOfErrors"), aErrorsText);
		ClassReference._setupErrorReportCounter(aErrorReportHandler.getProperty("numberOfWarnings"), aWarningsText);
		ClassReference._setupErrorReportCounter(aErrorReportHandler.getProperty("numberOfLogs"), aLogsText);
	};
});
