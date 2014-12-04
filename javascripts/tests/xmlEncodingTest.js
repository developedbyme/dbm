dbm.runTempFunction(function() {
	
	var DbmXmlEncoder = dbm.importClass("dbm.utils.xml.DbmXmlEncoder");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var testObject = {stringValue: "test", numberValue: 3, nullValue: null, items: [0, 1, 2], moreData: {field1: function() {return test;}, field2: true}};
		
		var testXml = DbmXmlEncoder.encodeXmlFromObject(testObject);
		
		console.log(testXml);
		console.log(XmlCreator.createStringFromXml(testXml));
	});
});