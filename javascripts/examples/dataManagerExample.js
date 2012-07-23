dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		
		//var startFunction = function(aDataXml) {
			//var xmlDefinition = XmlChildRetreiver.getFirstChild(aDataXml.getData());
			//var basePath = XmlChildRetreiver.getNamespacedAttribute(xmlDefinition, dbm.xmlNamespaces.dbmData, "basePath");
			//dbm.singletons.dbmDataManager.addXmlDefinition(xmlDefinition, basePath);
			
			dbm.singletons.dbmDataManager.addDefinitionFile("../xml/testData.xml", "dbmData", "testData");
			
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString2"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString3"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString4"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testFloat"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testFloat2"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testLink"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/linkedString"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testFile/testString3"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testAttributeLink"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/replacedText"));
			
			dbm.singletons.dbmDataManager.debugTraceStructure();
		//};
	
		//var testDataAsset = dbm.singletons.dbmAssetRepository.getAsset("../xml/testData.xml");
		//testDataAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, startFunction, [testDataAsset]));
		//testDataAsset.load();
	});
});