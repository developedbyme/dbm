(function() {
	
	var documentLoaded = function() {
		//console.log("documentLoaded");
		document.removeEventListener("DOMContentLoaded", documentLoaded, false);
		
		var currentArray = document.querySelectorAll(".listSection");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			
			var listItems = currentElement.querySelectorAll(".list > *");
			
			if(listItems.length === 0) {
				currentElement.style.setProperty("display", "none", "");
			}
		}
	}
	
	document.addEventListener("DOMContentLoaded", documentLoaded, false);
})();