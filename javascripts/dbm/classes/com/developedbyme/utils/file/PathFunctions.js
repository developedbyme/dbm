dbm.registerClass("com.developedbyme.utils.file.PathFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.PathFunctions");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	staticFunctions.getFileExtension = function(aPath) {
		var currentPath = ClassReference.getPathWithoutQueryStringOrAnchor(aPath);
		var dotPosition = currentPath.lastIndexOf(".");
		var slashPosition = currentPath.lastIndexOf("/");
		if(dotPosition == -1 || slashPosition > dotPosition) {
			return null;
		}
		return currentPath.substring(dotPosition+1, currentPath.length);
	};
	
	staticFunctions.getFileName = function(aPath) {
		var currentPath = ClassReference.getPathWithoutQueryStringOrAnchor(aPath);
		var dotPosition = currentPath.lastIndexOf(".");
		var slashPosition = currentPath.lastIndexOf("/");
		if(dotPosition == -1 || slashPosition > dotPosition) {
			return null;
		}
		if(slashPosition == -1) {
			currentPath = currentPath.substring(0, dotPosition);
		}
		else {
			currentPath = currentPath.substring(slashPosition+1, dotPosition);
		}
		return currentPath;
	};
	
	staticFunctions.getPathWithoutQueryStringOrAnchor = function(aPath) {
		var hashTagPosition = aPath.indexOf("#");
		var questionMarkPosition = aPath.indexOf("?");
		var minPosition = hashTagPosition;
		if(questionMarkPosition != -1 && (minPosition == -1 || questionMarkPosition < hashTagPosition)) {
			minPosition = questionMarkPosition;
		}
		if(minPosition == -1) {
			return aPath;
		}
		return aPath.substring(0, minPosition);
	};
	
	staticFunctions.removeInitialSlash = function(aPath) {
		if(aPath.charAt(0) == "/") {
			return aPath.substring(1, aPath.length);
		}
		return aPath;
	};
});