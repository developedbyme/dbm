dbm.runTempFunction(function() {
	
	var MediaQueryFunctions = dbm.importClass("com.developedbyme.utils.css.MediaQueryFunctions");
	
	var MediaQueryIsActiveNode = dbm.importClass("com.developedbyme.flow.nodes.css.MediaQueryIsActiveNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var mediaSelectionCriterias = MediaQueryFunctions.getFullSelectionCriteriaForMediaRulesOnDocument();
		console.log(mediaSelectionCriterias);
		
		var mediaQueryIsActiveNode = MediaQueryIsActiveNode.create("screen and (min-height: 300px) and (min-width: 700px)");
		var reportNode = ReportNode.create(mediaQueryIsActiveNode.getProperty("isActive"));
		reportNode.start();
		
		var mediaQueries = MediaQueryFunctions.getAllMediaRulesOnDocument();
		console.log(mediaQueries);
	});
});