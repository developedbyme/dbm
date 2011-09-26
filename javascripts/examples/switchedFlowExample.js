dbm.runTempFunction(function() {
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	var IndexSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	var FloorNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.FloorNode");
	var RepeatedRangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	var RoundToNumberOfDecimalsNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var timeNode = (new GlobalTimeNode()).init();
		timeNode.start();
		
		var divisionNode = (new DivisionNode()).init();
		divisionNode.getProperty("divisor").setValue(2);
		dbm.singletons.dbmFlowManager.connectProperties(timeNode.getProperty("time"), divisionNode.getProperty("inputValue"));
		
		var repeadedRangeNode = (new RepeatedRangeNode()).init();
		repeadedRangeNode.getProperty("maxValue").setValue(9);
		dbm.singletons.dbmFlowManager.connectProperties(divisionNode.getProperty("outputValue"), repeadedRangeNode.getProperty("inputValue"));
		
		var floorNode = (new FloorNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(repeadedRangeNode.getProperty("outputValue"), floorNode.getProperty("inputValue"));
		
		var indexSwithcedNode = (new IndexSwitchedNode()).init();
		var fieldsArray = indexSwithcedNode.getProperty("array").getValue();
		fieldsArray.push(document.getElementById("field1"));
		fieldsArray.push(document.getElementById("field2"));
		fieldsArray.push(document.getElementById("field3"));
		fieldsArray.push(document.getElementById("field4"));
		fieldsArray.push(document.getElementById("field5"));
		fieldsArray.push(document.getElementById("field6"));
		fieldsArray.push(document.getElementById("field7"));
		fieldsArray.push(document.getElementById("field8"));
		fieldsArray.push(document.getElementById("field9"));
		indexSwithcedNode.getProperty("array").setAsDirty();
		dbm.singletons.dbmFlowManager.connectProperties(floorNode.getProperty("outputValue"), indexSwithcedNode.getProperty("index"));
		
		var roundNode = (new RoundToNumberOfDecimalsNode()).init();
		roundNode.getProperty("numberOfDecimals").setValue(3);
		dbm.singletons.dbmFlowManager.connectProperties(timeNode.getProperty("time"), roundNode.getProperty("inputValue"));
		
		var printTextNode = (new PrintTextNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(roundNode.getProperty("outputValue"), printTextNode.getProperty("text"));
		dbm.singletons.dbmFlowManager.connectProperties(indexSwithcedNode.getProperty("outputValue"), printTextNode.getProperty("element"));
		
		//dbm.singletons.dbmFlowManager.updateProperty(printTextNode.getProperty("display"));
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printTextNode.getProperty("display"));
	});
});