/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.CsvComparison", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var CsvComparison = dbm.importClass("dbm.projects.tools.work.ar.CsvComparison");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.CsvComparison::_init");
		
		this.superCall();
		
		this._csvDataPath = "../assets/tools/work/ar/ingredientCorrections/resultIngredients.csv";
		this._csvData2Path = "../assets/tools/work/ar/ingredientCorrections/finalIngredients.csv";
		this._correctionsCsvPath = "../assets/tools/work/ar/ingredientCorrections/corrections.csv";
		
		return this;
	};
	
	objectFunctions._setup = function() {
		console.log("dbm.projects.tools.work.ar.CsvComparison::_setup");
		
		this.addCssLink("../styles/utils/display.css");
		
		this._assetsLoader.addAssetsByPath(this._csvDataPath, this._csvData2Path, this._correctionsCsvPath);
	};
	
	objectFunctions._assetsLoaded = function() {
		console.log("dbm.projects.tools.work.ar.CsvComparison::_assetsLoaded");
		this._createPage();
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.CsvComparison::_createPage");
		
		var csvData = dbm.singletons.dbmAssetRepository.getAssetData(this._csvDataPath);
		var parser = CsvParser.create(csvData);
		parser.parse();
		parser.addColumn(4);
		parser.addColumn(14);
		parser.addColumn(18);
		parser.addColumn(22);
		parser.getRow(0)[4] = "title_status";
		parser.getRow(0)[14] = "cupboard_essential_status";
		parser.getRow(0)[18] = "parent_id_status";
		parser.getRow(0)[22] = "synonym_status";
		
		var cupboardEssentialIndex = parser.findColumnByValue(0, "cupboard_essential");
		var databaseCupboardEssentialIndex = parser.findColumnByValue(0, "database_cupboard_essential");
		var finalCupboardEssentialIndex = parser.findColumnByValue(0, "final_cupboard_essential");
		var cupboardEssentialStatusIndex = parser.findColumnByValue(0, "cupboard_essential_status");
		
		console.log(cupboardEssentialIndex, databaseCupboardEssentialIndex, finalCupboardEssentialIndex, cupboardEssentialStatusIndex);
		
		var parentIdIndex = parser.findColumnByValue(0, "parent_id");
		var databaseParentIdIndex = parser.findColumnByValue(0, "database_parent_id");
		var finalParentIdIndex = parser.findColumnByValue(0, "final_parent_id");
		var parentIdStatusIndex = parser.findColumnByValue(0, "parent_id_status");
		
		console.log(parentIdIndex, databaseParentIdIndex, finalParentIdIndex, parentIdStatusIndex);
		
		var synonymIndex = parser.findColumnByValue(0, "synonym");
		var databaseSynonymIndex = parser.findColumnByValue(0, "database_synonym");
		var finalSynonymIndex = parser.findColumnByValue(0, "final_synonym");
		var synonymStatusIndex = parser.findColumnByValue(0, "synonym_status");
		
		console.log(synonymIndex, databaseSynonymIndex, finalSynonymIndex, synonymStatusIndex);
		
		
		
		var csvData2 = dbm.singletons.dbmAssetRepository.getAssetData(this._csvData2Path);
		var parser2 = CsvParser.create(csvData2);
		parser2.parse();
		
		var selectCupboardEssential = parser2.findColumnByValue(0, "Cupboard Essential");
		var selectSynonyms = parser2.findColumnByValue(0, "Synonym");
		var selectParent = parser2.findColumnByValue(0, "Parent ID (Name)");
		console.log(selectCupboardEssential, selectSynonyms);
		
		var correctionsCsvData = dbm.singletons.dbmAssetRepository.getAssetData(this._correctionsCsvPath);
		var correctionsCsvParser = CsvParser.create(correctionsCsvData);
		correctionsCsvParser.parse();
		
		var currentArray = parser2.getRows();
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) {
			var currentRow = currentArray[i];
			var currentTitle = currentRow[1];
			var searchText = currentTitle;
			var correctionIndex = correctionsCsvParser.findRowByFieldWithCompareFunction(1, currentTitle, ArraySortingFunctions.trimmedCaseInsensitive, 1);
			console.log(currentTitle, correctionIndex);
			if(correctionIndex !== -1 && correctionsCsvParser.getRow(correctionIndex)[0] !== "") {
				searchText = correctionsCsvParser.getRow(correctionIndex)[0];
			}
			
			var isFound = false;
			var isDuplicate = false;
			var currentIndex = 1;
			var debugCounter = 0;
			do {
				if(debugCounter++ > 10000) {
					//METODO: error message
					break;
				}
				var currentIndex = parser.findRowByFieldWithCompareFunction(2, searchText, ArraySortingFunctions.trimmedCaseInsensitive, currentIndex);
				if(currentIndex !== -1) {
					var matchedRow = parser.getRow(currentIndex);
					var existingTitle = matchedRow[2];
					var corrrectedTitle = matchedRow[3];
					if(corrrectedTitle === "") {
						isFound = true;
						matchedRow[3] = currentTitle;
						
						if(currentTitle.toLowerCase() === existingTitle.toLowerCase()) {
							if(currentTitle === existingTitle) {
								matchedRow[4] = "already done";
							}
							else {
								matchedRow[1] = currentTitle;
								matchedRow[4] = "capitalisation change";
							}
						}
						else {
							matchedRow[1] = currentTitle;
							matchedRow[4] = "updated";
						}
						
						matchedRow[finalCupboardEssentialIndex] = (currentRow[selectCupboardEssential] === "TRUE") ? "1" : "0";
						if(matchedRow[finalCupboardEssentialIndex] !== matchedRow[databaseCupboardEssentialIndex]) {
							matchedRow[cupboardEssentialIndex] = matchedRow[finalCupboardEssentialIndex];
							matchedRow[cupboardEssentialStatusIndex] = "updated";
						}
						else {
							matchedRow[cupboardEssentialStatusIndex] = "already done";
						}
						matchedRow[finalSynonymIndex] = currentRow[selectSynonyms];
						var newSynonyms = this._compareSynonyms(currentRow[selectSynonyms], matchedRow[databaseSynonymIndex]);
						matchedRow[synonymIndex] = newSynonyms;
						if(newSynonyms === matchedRow[databaseSynonymIndex] || (newSynonyms === "NULL" && matchedRow[databaseSynonymIndex] === "")) {
							if(matchedRow[finalSynonymIndex] === "" && newSynonyms !== "NULL") {
								matchedRow[synonymStatusIndex] = "not replaced";
							}
							else {
								matchedRow[synonymStatusIndex] = "already done";
							}
						}
						else if(newSynonyms === matchedRow[finalSynonymIndex] || (newSynonyms === "NULL" && matchedRow[finalSynonymIndex] === "") || matchedRow[databaseSynonymIndex] === "" || matchedRow[databaseSynonymIndex] === "NULL") {
							matchedRow[synonymStatusIndex] = "updated";
						}
						else {
							matchedRow[synonymStatusIndex] = "mixed";
						}
						
						var parentName = currentRow[selectParent];
						if(parentName !== "") {
							var correctionParentIndex = correctionsCsvParser.findRowByFieldWithCompareFunction(1, parentName, ArraySortingFunctions.trimmedCaseInsensitive, 1);
							if(correctionParentIndex !== -1) {
								parentName = correctionsCsvParser.getRow(correctionParentIndex)[0];
							}
							var parentIdSearchIndex = parser.findRowByFieldWithCompareFunction(2, parentName, ArraySortingFunctions.trimmedCaseInsensitive, 1);
							if(parentIdSearchIndex !== -1 && parser.getRow(parentIdSearchIndex)[0] !== "") {
								
								var parentId = parser.getRow(parentIdSearchIndex)[0];
								matchedRow[finalParentIdIndex] = parentId;
								if(matchedRow[0] === parentId) {
									matchedRow[parentIdStatusIndex] = "parent to itself";
								}
								else {
									if(matchedRow[finalParentIdIndex] === matchedRow[databaseParentIdIndex]) {
										matchedRow[parentIdStatusIndex] = "already done";
									}
									else {
										matchedRow[parentIdIndex] = parentId;
										matchedRow[parentIdStatusIndex] = "updated";
									}
								}
							}
							else {
								matchedRow[finalParentIdIndex] = parentName;
								if(parentIdSearchIndex === -1) {
									matchedRow[parentIdStatusIndex] = "parent doesn't exist";
								}
								else {
									matchedRow[parentIdStatusIndex] = "parent is not in database";
								}
							}
						}
						else {
							if(matchedRow[databaseParentIdIndex] !== "" && matchedRow[databaseParentIdIndex] !== "NULL") {
								matchedRow[parentIdStatusIndex] = "not replaced";
							}
						}
						
						break;
					}
					else {
						isDuplicate = true;
						currentIndex++;
					}
				}
			} while(currentIndex !== -1);
			if(!isFound && !isDuplicate) {
				var text = (isDuplicate) ? "duplicate" : "new";
				var newRow = parser.createRow();
				newRow[1] = currentTitle;
				newRow[3] = currentTitle;
				newRow[4] = text;
				
				newRow[finalCupboardEssentialIndex] = (currentRow[selectCupboardEssential] === "TRUE") ? "1" : "0";
				newRow[cupboardEssentialIndex] = newRow[cupboardEssentialIndex];
				newRow[cupboardEssentialStatusIndex] = (isDuplicate) ? "duplicate" : "new";
				newRow[finalSynonymIndex] = currentRow[selectSynonyms];
				newRow[synonymIndex] = newRow[finalSynonymIndex].replace(";", ",");
				newRow[synonymStatusIndex] = (isDuplicate) ? "duplicate" : "new";
				
				var parentName = currentRow[selectParent];
				if(parentName !== "") {
					var correctionParentIndex = correctionsCsvParser.findRowByFieldWithCompareFunction(1, parentName, ArraySortingFunctions.trimmedCaseInsensitive, 1);
					if(correctionParentIndex !== -1) {
						parentName = correctionsCsvParser.getRow(correctionParentIndex)[0];
					}
					var parentIdSearchIndex = parser.findRowByFieldWithCompareFunction(2, parentName, ArraySortingFunctions.trimmedCaseInsensitive, 1);
					if(parentIdSearchIndex !== -1 && parser.getRow(parentIdSearchIndex)[0] !== "") {
						var parentId = parser.getRow(parentIdSearchIndex)[0];
						newRow[finalParentIdIndex] = parentId;
						newRow[parentIdIndex] = parentId;
						newRow[parentIdStatusIndex] = "new";
					}
					else {
						newRow[finalParentIdIndex] = parentName;
						if(parentIdSearchIndex !== -1) {
							newRow[parentIdStatusIndex] = "parent doesn't exist";
						}
						else {
							newRow[parentIdStatusIndex] = "parent is not in database";
						}
					}
				}
			}
		}
		
		console.log(parser);
		console.log(parser.encode());
		
		/*
		list.sort();
		list2.sort();
		
		ArrayFunctions.removeDuplicates(list);
		ArrayFunctions.removeDuplicates(list2);
		
		console.log(list);
		console.log(list2);
		
		var arrayComparison = ArrayComparison.create();
		arrayComparison.compareArrays(list, list2);
		console.log(arrayComparison);
		
		console.log(arrayComparison._existsOnlyInArray1.join("\n"));
		console.log(arrayComparison._existsOnlyInArray2.join("\n"));
		*/
	};
	
	objectFunctions._compareSynonyms = function(aNewSynonyms, aOldSynonyms) {
		if(aNewSynonyms === aOldSynonyms && aNewSynonyms !== "") {
			return aNewSynonyms;
		}
		var joinArray = new Array();
		if(aOldSynonyms !== "NULL" && aOldSynonyms !== "") {
			joinArray = joinArray.concat(StringFunctions.splitSeparatedString(aOldSynonyms));
		}
		if(aNewSynonyms !== "NULL" && aNewSynonyms !== "") {
			joinArray = joinArray.concat(StringFunctions.splitSeparatedString(aNewSynonyms, ";"));
		}
		if(joinArray.length === 0) {
			return "NULL";
		}
		ArrayFunctions.removeDuplicates(joinArray);
		return joinArray.join(", ");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new CsvComparison()).init();
	};
});