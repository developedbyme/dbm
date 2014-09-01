(function() {
	
	var addListenersToButton = function(aButton, aHolder) {
		var isShowing = false;
		
		var showHideFunction = function(aEvent) {
			isShowing = !isShowing;
			if(isShowing) {
				aHolder.classList.remove("folded");
				aButton.textContent = "Hide code";
			}
			else {
				aHolder.classList.add("folded");
				aButton.textContent = "Show code";
			}
		};
		
		aButton.addEventListener("click", showHideFunction, false);
	}
	
	var documentLoaded = function() {
		console.log("documentLoaded");
		document.removeEventListener("DOMContentLoaded", documentLoaded, false);
		
		var currentArray = document.querySelectorAll(".foldableCode");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			
			var newButton = document.createElement("div");
			newButton.textContent = "Show code";
			newButton.classList.add("foldButton");
			
			addListenersToButton(newButton, currentElement);
			currentElement.insertBefore(newButton, currentElement.firstChild);
			
			currentElement.classList.add("folded");
		}
	}
	
	document.addEventListener("DOMContentLoaded", documentLoaded, false);
})();