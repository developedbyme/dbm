dbm.runTempFunction(function() {
	
	var ObjectFromFunctionCreator = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator");
	var DbmXmlEncoder = dbm.importClass("com.developedbyme.utils.xml.DbmXmlEncoder");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		console.log("--- Test 1 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3}, ["name"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("new name"));
		
		console.log("--- Test 2 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3, dataValues: [1, 2, 3]}, ["name", "secondValue"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		templateFunctionObject.insertArgumentByName("secondValue", "dataValues/1");
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("array test", 4));
		
		console.log("--- Test 3 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3, dataValues: [1, {evenMoreComplexData: "This is the default value"}, 3]}, ["name", "secondValue"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		templateFunctionObject.insertArgumentByName("secondValue", "dataValues/1/evenMoreComplexData", true);
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("default test 1", "Value has been updated"));
		console.log(templateFunctionObject.createObject("default test 2"));
		console.log(XmlCreator.createStringFromXml(DbmXmlEncoder.encodeXmlFromObject(templateFunctionObject.createObject("default test 3", "Value has been updated"))));
		
	});
});