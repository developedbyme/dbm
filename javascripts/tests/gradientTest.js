dbm.runTempFunction(function() {
	
	var CssLanguageFunctions = dbm.importClass("dbm.utils.native.string.CssLanguageFunctions");
	var CssReferenceFunctions = dbm.importClass("dbm.utils.css.CssReferenceFunctions");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var testStyleSheet = CssReferenceFunctions.getStyleSheetByPathOnDocument("../styles/testGradient.css");
		console.log(testStyleSheet);
		
		var currentStyles = CssReferenceFunctions.getStyleDeclarationsBySelectorOnDocument(".testGradient");
		console.log(currentStyles);
		
		var gradientValue = currentStyles[0].getPropertyValue("background-image");
		var newGradient = CssLanguageFunctions.createGradientFromCss(gradientValue);
		
		console.log(gradientValue);
		console.log(newGradient);
		console.log(newGradient.getCssString());
		
	});
});