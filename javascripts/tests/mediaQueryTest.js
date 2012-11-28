dbm.runTempFunction(function() {
	
	var MediaQueryFunctions = dbm.importClass("com.developedbyme.utils.css.MediaQueryFunctions");
	
	var MediaQueryIsActiveNode = dbm.importClass("com.developedbyme.flow.nodes.css.MediaQueryIsActiveNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var ProgrammingLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.ProgrammingLanguageFunctions");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var mediaSelectionCriterias = MediaQueryFunctions.getFullSelectionCriteriaForMediaRulesOnDocument();
		console.log(mediaSelectionCriterias);
		
		var mediaQueryIsActiveNode = MediaQueryIsActiveNode.create("screen and (min-height: 300px) and (min-width: 700px)");
		var reportNode = ReportNode.create(mediaQueryIsActiveNode.getProperty("isActive"));
		reportNode.start();
		
		var mediaQueries = MediaQueryFunctions.getAllMediaRulesOnDocument();
		console.log(mediaQueries);
		
		var currentArray = mediaQueries;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentRule = currentArray[i];
			var currentSelectionCriteria = MediaQueryFunctions.getCombinedSelectionCriteriaForMediaRule(currentRule);
			console.log(currentSelectionCriteria);
		}
		
		var splitTestQuery = "screen and (color) and (min-height: 300px) and (min-width: 700px), handheld and (color) and (min-height: 300px) and (min-width: 700px), (color) and (aspect-ratio: 4, '/', 3), (color) and (aspect-ratio: 4, '/', 3) and (min-height: 400px) and (min-width: 800px), screen and (color) and (aspect-ratio: 4, '/', 3), handheld and (color) and (aspect-ratio: 4, '/', 3), screen and (color) and (aspect-ratio: 4, '/', 3), handheld and (min-width: 800px) and (color) and (aspect-ratio: 4, '/', 3)";
		var splittedArray = ProgrammingLanguageFunctions.getSeparatedArray(splitTestQuery, [","]);
		console.log(splittedArray);
	});
});