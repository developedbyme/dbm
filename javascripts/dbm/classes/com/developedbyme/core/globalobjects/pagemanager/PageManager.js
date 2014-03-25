/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.pagemanager.PageManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.pagemanager.PageManager");
	
	var PageManager = dbm.importClass("com.developedbyme.core.globalobjects.pagemanager.PageManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	dbm.setClassAsSingleton("dbmPageManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.pagemanager.PageManager::_init");
		
		this.superCall();
		
		this._queryStringParameters = NamedArray.create(false);
		this._document = null;
		this._documentLocation = null;
		this._url = null;
		this._urlResolver = null;
		
		return this;
	};
	
	objectFunctions.addToSharedRandomValues = function(aValuesArray) {
		console.log("com.developedbyme.core.globalobjects.pagemanager.PageManager::addToSharedRandomValues");
		
		StringFunctions.getCharCodes(this._documentLocation.toString(), aValuesArray);
		
		return this;
	};
	
	objectFunctions.setDocument = function(aDocument) {
		
		this._document = aDocument;
		this._documentLocation = this._document.location.href;
		
		return this;
	};
	
	objectFunctions.setDocumentLocation = function(aLocation) {
		this._documentLocation = aLocation;
		this._setUrl(this._documentLocation);
	};
	
	objectFunctions.getDocument = function() {
		
		return this._document;
	};
	
	objectFunctions._setUrl = function(aUrl) {
		this._url = aUrl;
		this._urlResolver = UrlResolver.createFromFilePath(aUrl);
	};
	
	objectFunctions.getUrl = function() {
		return this._url;
	};
	
	objectFunctions.getUrlResolver = function() {
		return this._urlResolver;
	};
	
	objectFunctions.getCurrentFolderPath = function() {
		
		var currentPath = PathFunctions.getPathWithoutQueryStringOrAnchor(this._documentLocation);
		var protocolPosition = currentPath.indexOf("://");
		if(protocolPosition !== -1) {
			currentPath = currentPath.substring(protocolPosition+3, currentPath.length);
		}
		var slashIndex = currentPath.indexOf("/");
		if(slashIndex === -1) {
			return "";
		}
		currentPath = currentPath.substring(slashIndex, currentPath.length);
		
		var slashIndex = currentPath.lastIndexOf("/");
		if(slashIndex === -1) {
			return "";
		}
		currentPath = currentPath.substring(0, slashIndex);
		
		return currentPath;
	};
	
	objectFunctions.getFileName = function() {
		
		var currentPath = PathFunctions.getPathWithoutQueryStringOrAnchor(this._documentLocation);
		currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
		
	};
	
	objectFunctions.getFolderName = function(aParentNumber) {
		
		aParentNumber = VariableAliases.valueWithDefault(aParentNumber, 0);
		
		var folderPathArray = this.getCurrentFolderPath().split("/");
		folderPathArray.shift();
		
		if(aParentNumber >= folderPathArray.length) {
			//METODO: error message
			return null;
		}
		
		return folderPathArray[folderPathArray.length-1-aParentNumber];
	};
	
	objectFunctions.setupQueryStringParameters = function() {
		var queryString = this._documentLocation;
		var queryIndex = queryString.indexOf("?");
		var queryStringArray = [];
		
		if(queryIndex !== -1) {
			this._setUrl(queryString.substring(0, queryIndex));
			queryString = queryString.substring(queryIndex+1, queryString.length);
			queryStringArray = queryString.split("&");
		}
		else {
			this._setUrl(queryString);
		}
		for(var i = 0; i < queryStringArray.length; i++) {
			var tempArray = queryStringArray[i].split("=");
			this.setQueryStringParameter(tempArray[0], tempArray[1]);
		}
	};
	
	objectFunctions.setQueryStringParameter = function(aName, aValue) {
		this._queryStringParameters.addObject(aName, aValue);
	};
	
	objectFunctions.getQueryStringParameter = function(aName) {
		if(this._queryStringParameters.select(aName)) {
			return this._queryStringParameters.currentSelectedItem;
		}
		//METODO: error manager
		return null;
	};
		
	objectFunctions.hasQueryStringParameter = function(aName) {
		return this._queryStringParameters.hasObject(aName);
	};
	
});