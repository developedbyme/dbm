dbm.runTempFunction(function() {
	
	var LevenshteinDistance = dbm.importClass("dbm.utils.native.string.LevenshteinDistance");
	
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var StringAliases = dbm.importClass("dbm.utils.native.string.StringAliases");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var fileName = "../assets/tests/csvParser/foodCategories.xml";
		
		var fileLoaded = function() {
			console.log("loaded");
			
			var asset = dbm.singletons.dbmAssetRepository.getAsset(fileName);
			console.log(asset.getData());
			
			var idsArray = new Array();
			
			XmlChildRetreiver.getAllValuesForAttribute(asset.getData(), "id", idsArray);
			
			var levenshteinDistance = LevenshteinDistance.create();
			
			console.log(levenshteinDistance);
			
			console.log(levenshteinDistance.compareStrings("kitten", "sitting"));
			
			/*
			var searchInput = "Tabasco";
			var searchWords = ["apple", "pineapple", "banana", "orange", "radish", "carrot", "pea", "bean", "potato"];
			
			console.log(">>>", searchInput);
			
			var currentArray = idsArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentWord = currentArray[i];
				console.log(currentWord, levenshteinDistance.compareStrings(searchInput, currentWord));
			}
			*/
			
			var inputField = InputField.createOnParent(dbm.getDocument().body, true, "Search");
			inputField.activate();
			var textField = TextElement.create(dbm.getDocument().body, true, "");
			textField.getProperty("display").startUpdating();
			
			var textUpdated = function() {
				console.log("textUpdated");
				var currentText = inputField.getValue().toLowerCase();
				console.log(currentText);
				
				var lowestText = "";
				var lowestValue = 1000;
				
				if(currentText !== "") {
					var currentArray = idsArray;
					var currentArrayLength = currentArray.length;
					for(var i = 0; i < currentArrayLength; i++) {
						var currentWord = currentArray[i].toLowerCase();
					
						//var minScore = Math.abs(currentText.length-currentWord.length);
						//var maxScore = Math.max(currentText.length, currentWord.length);
						var testValue = levenshteinDistance.compareStrings(currentText, currentWord);
						if(currentText.length < currentWord.length) {
							var testValue2 = levenshteinDistance.compareStrings(currentText, currentWord.substring(0, currentText.length));
							if(testValue2 < testValue) {
								testValue = testValue2;
							}
						}
						if(testValue < lowestValue) {
							lowestValue = testValue;
							lowestText = currentArray[i];
						}
					}
				}
				
				//console.log(lowestText);
				textField.getProperty("text").setValue(lowestText);
			};
			
			inputField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, textUpdated, []));
			
			var stringReplacements = StringAliases.create();
			stringReplacements.addAliasesToValue(["1", "2", "3", "4"], "test");
			stringReplacements.addAliasesToValue(["1e", "2e", "3e", "4e"], "testE");
			
			console.log(stringReplacements);
			console.log(stringReplacements.resolveAlias("3"));
		};
		
		var loader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		loader.load();
	});
});