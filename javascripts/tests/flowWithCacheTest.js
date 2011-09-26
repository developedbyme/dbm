dbm.runTempFunction(function() {
	
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var additionNode = (new AdditionNode()).init();
		additionNode._inputValue1.setValue(2);
		additionNode._inputValue2.setValue(3);
		
		var additionNode2 = (new AdditionNode()).init();
		additionNode2._inputValue2.setValue(4);
		
		dbm.singletons.dbmFlowManager.connectProperties(additionNode._outputValue, additionNode2._inputValue1);
		
		dbm.singletons.dbmFlowManager.updateProperty(additionNode2._outputValue);
		
		additionNode._inputValue1.setValue(1);
		additionNode._inputValue2.setValue(4);
		
		dbm.singletons.dbmFlowManager.updateProperty(additionNode2._outputValue);
	});
});