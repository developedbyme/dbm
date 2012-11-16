dbm.runTempFunction(function() {
	
	var MediaQueryFunctions = dbm.importClass("com.developedbyme.utils.css.MediaQueryFunctions");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var mediaSelectionCriterias = MediaQueryFunctions.getFullSelectionCriteriaForMediaRulesOnDocument();
		console.log(mediaSelectionCriterias);
	});
});