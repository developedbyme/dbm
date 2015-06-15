dbm.runTempFunction(function() {
	
	var MediaQueryFunctions = dbm.importClass("dbm.utils.css.MediaQueryFunctions");
	
	var MediaQueryIsActiveNode = dbm.importClass("dbm.flow.nodes.css.MediaQueryIsActiveNode");
	var ReportNode = dbm.importClass("dbm.flow.nodes.debug.ReportNode");
	var ValueSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.ValueSwitchedNode");
	var SetMediaQuerySelectionNode = dbm.importClass("dbm.flow.nodes.css.SetMediaQuerySelectionNode");
	
	var ProgrammingLanguageFunctions = dbm.importClass("dbm.utils.native.string.ProgrammingLanguageFunctions");
	
	var EnabledStatusTypes = dbm.importClass("dbm.constants.status.EnabledStatusTypes");
	
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
			
			
			var valueSwitchNode = ValueSwitchedNode.create(EnabledStatusTypes.ENABLED);
			valueSwitchNode.addItem(EnabledStatusTypes.DISABLED, "not all");
			valueSwitchNode.addItem(EnabledStatusTypes.ENABLED, currentSelectionCriteria);
			valueSwitchNode.addItem(EnabledStatusTypes.FORCE_ENABLED, "all");
			
			var setMediaQueryNode = SetMediaQuerySelectionNode.create(valueSwitchNode.getProperty("outputValue"), currentRule);
			setMediaQueryNode.getProperty("rule").startUpdating();
		}
		
		var splitTestQuery = "screen and (color) and (min-height: 300px) and (min-width: 700px), handheld and (color) and (min-height: 300px) and (min-width: 700px), (color) and (aspect-ratio: 4, '/', 3), (color) and (aspect-ratio: 4, '/', 3) and (min-height: 400px) and (min-width: 800px), screen and (color) and (aspect-ratio: 4, '/', 3), handheld and (color) and (aspect-ratio: 4, '/', 3), screen and (color) and (aspect-ratio: 4, '/', 3), handheld and (min-width: 800px) and (color) and (aspect-ratio: 4, '/', 3)";
		var splittedArray = ProgrammingLanguageFunctions.getSeparatedArray(splitTestQuery, [","]);
		console.log(splittedArray);
	});
});