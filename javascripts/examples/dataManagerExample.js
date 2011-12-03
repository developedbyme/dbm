dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		
		var startFunction = function(aDataXml) {
			
			var xmlDefinition = XmlChildRetreiver.getFirstChild(aDataXml.getData());
			var basePath = XmlChildRetreiver.getNamespacedAttribute(xmlDefinition, dbm.xmlNamespaces.dbmData, "basePath");
			
			dbm.singletons.dbmDataManager.addXmlDefinition(xmlDefinition, basePath);
			
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString2"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString3"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testString4"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testFloat"));
			console.log(dbm.singletons.dbmDataManager.getData("testData/testFloat2"));
		};
	
		var testDataAsset = dbm.singletons.dbmAssetRepository.getAsset("../xml/testData.xml");
		testDataAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, startFunction, [testDataAsset]));
		testDataAsset.load();
	});
});