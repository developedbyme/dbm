dbm.runTempFunction(function() {
	
	//var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	//var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var HtmlInputTypes = dbm.importClass("com.developedbyme.constants.HtmlInputTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var newElement = htmlCreator.createNode("div", {id: "test", name: "testName"}, 
			"First text goes here ",
			htmlCreator.createNode("span", null, "(Second text)"),
			htmlCreator.createNode("div", {name: "imageNode", style: "width: 300px; height: 300px; background-color: #FF0000"}, 
				"Image",
				htmlCreator.createImage("dev/null.jpg"),
				htmlCreator.createLink("dev/null", "_blank", null,
					"Link in new window, ",
					"Click here!"
				)
			),
			htmlCreator.createNode("div", {name: "form"},
				htmlCreator.createForm("dev/null", "POST", null,
					htmlCreator.createInput("name", HtmlInputTypes.TEXT, "value in field", null),
					htmlCreator.createInput("submit", HtmlInputTypes.SUBMIT, "submit", null)
				)
			)
		);
		
		document.body.appendChild(newElement);
		
		console.log(newElement);
	});
});