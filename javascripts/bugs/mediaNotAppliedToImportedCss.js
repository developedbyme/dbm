(function() {
	var styleSheet = document.styleSheets[0];
	var importNode = styleSheet.cssRules[0];
	var importedStyleSheet = importNode.styleSheet;
	
	console.log("Media of import node", importNode.media);
	console.log("Media of style sheet", importedStyleSheet.media);
})();