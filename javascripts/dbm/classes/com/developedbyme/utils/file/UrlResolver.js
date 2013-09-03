dbm.registerClass("com.developedbyme.utils.file.UrlResolver", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.UrlResolver");
	
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.UrlResolver::_init");
		
		this.superCall();
		
		this._basePath = "";
		this._folderNamesArray = new Array();
		
		return this;
	};
	
	objectFunctions.setupBaseUrl = function(aBasePath, aFolders) {
		this._basePath = aBasePath;
		if(aFolders !== null) {
			this._folderNamesArray = aFolders.split("/");
		}
	};
	
	objectFunctions.setupBaseUrlFromPath = function(aPath) {
		if(aPath.lastIndexOf("/") === aPath.length - 1) {
			aPath = aPath.substring(0, aPath.length - 1);
		}
		var colonSlashSlashIndex = aPath.indexOf("://");
		var basePathEndIndex;
		if(colonSlashSlashIndex > -1) {
			basePathEndIndex = aPath.indexOf("/", colonSlashSlashIndex + 3);
		} else {
			basePathEndIndex = aPath.indexOf("/");
		}
		
		if(basePathEndIndex === -1) {
			this._basePath = aPath;
			this._folderNamesArray = new Array();
		} else {
			this._basePath = aPath.substring(0, basePathEndIndex);
			aPath = aPath.substring(basePathEndIndex + 1, aPath.length);
			this._folderNamesArray = aPath.split("/");
		}
	};
	
	objectFunctions.setupBaseUrlFromFilePath = function(aPath) {
		var questionMarkPosition = aPath.indexOf("?");
		var anchorMarkPosition = aPath.indexOf("#");
		var removeEndPosition = -1;
		if(questionMarkPosition > -1) {
			removeEndPosition = questionMarkPosition;
		}
		if(anchorMarkPosition > -1) {
			if((removeEndPosition === -1) || (anchorMarkPosition < removeEndPosition)) {
				removeEndPosition = anchorMarkPosition;
			}
		}
		
		if(removeEndPosition !== -1) {
			aPath = aPath.substring(0, removeEndPosition);
		}
		var slashPosition = aPath.lastIndexOf("/");
		if(slashPosition !== -1) {
			aPath = aPath.substring(0, slashPosition);
		}
		this.setupBaseUrlFromPath(aPath);
	};
	
	objectFunctions.getAbsolutePath = function(aPath) {
		if(aPath === null) {
			//METODO: error message
			return null;
		}
		
		if(aPath === "") {
			return this._basePath + "/" + this._folderNamesArray.join("/");
		}
		
		if(aPath.indexOf("/") === 0) { 
			//MENOTE: aPath is relative to base of url
			if(this._basePath.indexOf("://") > -1) {
				return this._basePath + aPath;
			} else {
				return aPath;
			}
		}
		
		var colonSlashSlashIndex = aPath.indexOf("://");
		if(colonSlashSlashIndex > -1) {
			var questionMarkPosition = aPath.indexOf("?");
			if((questionMarkPosition === -1) || (colonSlashSlashIndex < questionMarkPosition)) {
				return aPath;
			}
		}
		
		var endNr = this._folderNamesArray.length;
		
		var finalPath = aPath;
		if(finalPath.indexOf("../") === 0) {
			while(finalPath.indexOf("../") === 0) {
				endNr--;
				finalPath = finalPath.substring(3, finalPath.length);
			}
		}
		var returnPath = this._basePath + "/";
		if(this._folderNamesArray.length > 0) {
			var currentArray = this._folderNamesArray;
			for(var i = 0;i < endNr; i++) {
				returnPath += currentArray[i] + "/";
			}
		}
		returnPath += finalPath;
		return returnPath;
	};
	
	objectFunctions.getRelativePath = function(aPath) {
		
		var workPath = aPath;
		
		if(workPath.indexOf(this._basePath) !== 0) {
			//METODO: error message
			return null;
		}
		
		workPath = workPath.substring(this._basePath.length + 1, workPath.length);
		
		var questionMarkPosition = workPath.indexOf("?");
		var queryString = ""; //MENOTE: should include ? if exists
		if(questionMarkPosition !== -1) {
			queryString = workPath.substring(questionMarkPosition, workPath.length);
			workPath = workPath.substring(0, questionMarkPosition);
		}
		
		var returnString = "";
		
		var workPathArray = workPath.split("/");
		var currentArray = this._folderNamesArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			if(workPathArray.length === 0 || workPathArray[0] !== currentArray[i]) {
				returnString += this._getLevelUpPath(theLength - i);
				break;
			} else {
				workPathArray.shift();
			}
		}
		returnString += workPathArray.join("/") + queryString;
		return returnString;
	};
	
	objectFunctions._getLevelUpPath = function(aLength) {
		var returnString = "";
		for(var i = 0; i < aLength; i++) {
			returnString += "../";
		}
		return returnString;
	};
	
	staticFunctions.create = function() {
		var newUrlResolver = (new ClassReference()).init();
		return newUrlResolver;
	};
	
	staticFunctions.createFromFilePath = function(aPath) {
		var newUrlResolver = (new ClassReference()).init();
		newUrlResolver.setupBaseUrlFromFilePath(aPath);
		return newUrlResolver;
	};
});