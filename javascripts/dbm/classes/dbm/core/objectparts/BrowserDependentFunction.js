/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.objectparts.BrowserDependentFunction", "dbm.core.objectparts.ExtendedFunctionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.BrowserDependentFunction");
	//"use strict";
	
	var BrowserDependentFunction = dbm.importClass("dbm.core.objectparts.BrowserDependentFunction");
	var VersionNumber = dbm.importClass("dbm.utils.native.number.VersionNumber");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.BrowserDependentFunction::_init");
		
		this.superCall();
		
		this._defaultFunction = null;
		
		this._browsers = NamedArray.create(true);
		this.addDestroyableObject(this._browsers);
		
		return this;
	};
	
	objectFunctions.setDefaultFunction = function(aFunction) {
		//console.log("dbm.core.objectparts.BrowserDependentFunction::setDefaultFunction");
		
		this._defaultFunction = aFunction;
		
		return this;
	};
	
	objectFunctions.addBrowserSpecificFunction = function(aBrowserName, aBrowserVersion, aFunction) {
		//console.log("dbm.core.objectparts.BrowserDependentFunction::addBrowserSpecificFunction");
		
		var browserName = aBrowserName.toLowerCase();
		
		var currentArray;
		if(this._browsers.select(browserName)) {
			currentArray = this._browsers.currentSelectedItem;
		}
		else {
			currentArray = new Array();
			this._browsers.addObject(browserName, currentArray);
		}
		
		var browserVersion = (aBrowserVersion === null) ? "0" : aBrowserVersion.toString();
		
		var dataObject = {"version": browserVersion, "function": aFunction};
		
		currentArray.push(dataObject);
		//METODO: sort array
		
		return this;
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		//console.log("dbm.core.objectparts.BrowserDependentFunction::_performCallFunction");
		var browserName = dbm.singletons.dbmBrowserDetector.browserName.toLowerCase();
		var browserVersion = dbm.singletons.dbmBrowserDetector.browserVersion;
		
		var theFunction = null;
		
		if(this._browsers.select(browserName)) {
			var currentArray = this._browsers.currentSelectedItem;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentVersionFunction = currentArray[i];
				var currentVersion = currentVersionFunction["version"];
				if(VersionNumber.compareVersions(browserVersion, currentVersion) >= 0) {
					theFunction = currentVersionFunction["function"];
					break;
				}
			}
		}
		if(theFunction === null) {
			theFunction = this._defaultFunction;
		}
		
		return theFunction.apply(this._owner, aArguments);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._defaultFunction = null;
		this._browsers = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwner) {
		var newFunction = (new BrowserDependentFunction()).init().setOwner(aOwner);
		return newFunction;
	};
});