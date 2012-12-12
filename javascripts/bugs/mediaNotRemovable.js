(function() {
	var styleSheet = document.styleSheets[0];
	var mediaQuery = styleSheet.cssRules[0];
	
	var mediaList = mediaQuery.media;
	
	var mediaListLength = mediaList.length;
	
	for(var i = 0; i < mediaListLength; i++) {
		console.log("removing", mediaList[0]);
		mediaList.deleteMedium(mediaList[0]);
	}
	
})();