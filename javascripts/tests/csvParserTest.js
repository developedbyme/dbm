dbm.runTempFunction(function() {
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	
	var TableElement = dbm.importClass("dbm.gui.table.TableElement");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		var fileName = "../assets/tests/csvParser/example.csv";
		
		var fileLoaded = function() {
			console.log("loaded");
			
			var asset = dbm.singletons.dbmAssetRepository.getAsset(fileName);
			
			var parser = CsvParser.create(asset.getData());
			
			console.log(parser);
			
			parser.parse();
			
			var returnArray = new Array();
			var numberOfDuplicates = 0;
			
			var printArray = new Array();
			
			var currentArray = parser.getRows();
			var currentArrayLength = currentArray.length;
			for(var i = 2; i < currentArrayLength; i++) {
				var currentArray2 = currentArray[i][5].split(";");
				var currentArray2Length = currentArray2.length;
				
				printArray.push(currentArray[i][1] + ": " + currentArray2[0] + ", " + currentArray2[1]);
				for(var j = 0; j < currentArray2Length; j++) {
					if(ArrayFunctions.indexOfInArray(returnArray, currentArray2[j]) === -1) {
						returnArray.push(currentArray2[j]);
					}
					else {
						numberOfDuplicates++;
					}
				}
			}
			
			console.log(numberOfDuplicates);
			//console.log(printArray.join("\n"));
			
			/*
			returnArray.sort(function(a,b) {
				a = a.toLowerCase();
				b = b.toLowerCase();
				if( a == b) return 0;
				if( a > b) return 1;
				return -1;
			});
			*/
			
			returnArray.sort(function(a,b) {
				a = a.length;
				b = b.length;
				if( a == b) return 0;
				if( a > b) return -1;
				return 1;
			});
			
			console.log(returnArray.join("\n"));
			
			//var dataArray = parser.getAssociativeArray(parser.getRow(0), 2, 300);
			//console.log(dataArray);
			
			//var table = TableElement.create(dbm.getDocument().body, false);
			//console.log(table);
			
			//table.setFields(parser.getRow(0));
			//table.setData(dataArray);
		}
		
		var loader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		loader.load();
	});
});