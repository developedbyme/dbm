(function() {
	var theMediaQueryList = window.matchMedia("screen and (max-width: 600px)");
	
	theMediaQueryList.addListener(function(aMediaQueryList) {
		console.log("Function started");
		objectThatDoesNotExist.produceError();
		console.log("Function ended");
	});
	
})();

