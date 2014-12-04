/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.pagemanager.PageManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.pagemanager.PageManager");
	
	//Self reference
	var PageManager = dbm.importClass("dbm.core.globalobjects.pagemanager.PageManager");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var UrlResolver = dbm.importClass("dbm.utils.file.UrlResolver");
	
	//Utils
	var UrlFunctions = dbm.importClass("dbm.utils.native.string.UrlFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("dbm.utils.file.PathFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	
	dbm.setClassAsSingleton("dbmPageManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.pagemanager.PageManager::_init");
		
		this.superCall();
		
		this._queryStringParameters = NamedArray.create(false);
		this._document = null;
		this._documentLocation = null;
		this._url = null;
		this._urlResolver = null;
		
		return this;
	};
	
	objectFunctions.addToSharedRandomValues = function(aValuesArray) {
		console.log("dbm.core.globalobjects.pagemanager.PageManager::addToSharedRandomValues");
		
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
		
		if(queryIndex !== -1) {
			this._setUrl(queryString.substring(0, queryIndex));
			queryString = queryString.substring(queryIndex+1, queryString.length);
			UrlFunctions.parseQueryString(queryString, this._queryStringParameters);
		}
		else {
			this._setUrl(queryString);
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