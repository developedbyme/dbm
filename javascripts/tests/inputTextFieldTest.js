dbm.runTempFunction(function() {
	
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var HtmlInputTypes = dbm.importClass("dbm.constants.htmldom.HtmlInputTypes");
	var ParseFloatNode = dbm.importClass("dbm.flow.nodes.parse.ParseFloatNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons.dbmWindowManager.getMasterWindow().getHtmlCreator();
		var form = htmlCreator.createForm("#", "GET");
		var fieldElement1 = htmlCreator.createInput("field1", HtmlInputTypes.TEXT);
		var fieldElement2 = htmlCreator.createInput("field2", HtmlInputTypes.TEXT);
		var fieldElement3 = htmlCreator.createInput("field3", HtmlInputTypes.TEXT);
		
		document.body.appendChild(fieldElement1);
		document.body.appendChild(fieldElement2);
		document.body.appendChild(fieldElement3);
		
		var field1 = InputField.create(fieldElement1, "first value").activate();
		var field2 = InputField.create(fieldElement2, "second value").activate();
		var field3 = InputField.create(fieldElement3).activate();
		
		var additionNode = AdditionNode.create(ParseFloatNode.create(field1.getProperty("value")).getProperty("outputValue"), ParseFloatNode.create(field2.getProperty("value")).getProperty("outputValue"));
		field3.setPropertyInput("value", additionNode.getProperty("outputValue"));
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(field3.getProperty("display"));
	});
});