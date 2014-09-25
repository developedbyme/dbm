/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
(function(aGlobalObject) {
	//"use strict";
	
	var dbmObject;
	
	if(aGlobalObject.dbm === undefined) {
		dbmObject = new (function DBM(){})();
		aGlobalObject.dbm = dbmObject;
	}
	else {
		dbmObject = aGlobalObject.dbm;
	}
	
	if(dbmObject.isCreated !== true) {
		dbmObject.init = function() {
			this._environmentName = "extendScript";
			
			this.singletons = new Object();
			this.xmlNamespaces = new Object();
			this._specificClassesFolders = new Object();
			this._filesToLoad = new Array();
			this._currentFile = 0;
			this._startFunctions = new Array();
			this._classManager = null;
			this._window = null;
			this._document = null;
			this._javascriptsFolder = null;
			this._classesFolder = null;
			this._javascriptVersion = null;
			this.tempObject = null;
			this.tempClassFunction = null;
			this._startupSeed = new Array();
			this._startupSeed.push(Date.now());
			
			this._isStarting = false;
			this._restartAfterStart = false;
			
			this.isCreated = true;
			
			//MENOTE: sealing the object gets much lower perfomance
			//if(Object.seal !== undefined) {
			//	Object.seal(this);
			//}
		};
		
		dbmObject.getEnvironmentName = function() {
			return this._environmentName;
		};
		
		dbmObject.getDocument = function() {
			return this._document;
		};
		
		dbmObject.getWindow = function() {
			return this._window;
		};
		
		dbmObject.getStartupSeed = function() {
			return this._startupSeed;
		};
		
		dbmObject.setClassManager = function(aObject) {
			this._startupSeed.push(Date.now());
			this._classManager = aObject;
			
			this.singletons.dbmClassManager = aObject;
		};
		
		dbmObject.setup = function(aWindow, aDocument, aJavascriptsFolder, aClassesFolder) {
			//console.log("dbm.setup");
			this._window = aWindow;
			this._document = aDocument;
			this._javascriptsFolder = aJavascriptsFolder;
			this._classesFolder = aClassesFolder;
			
			return this;
		};
		
		dbmObject.addSpecificClassesFolder = function(aClassPathPrefix, aClassesFolder) {
			this._specificClassesFolders[aClassPathPrefix] = aClassesFolder;
			
			return this;
		};
		
		dbmObject.addStartFunction = function(aFunction) {
			//console.log("dbm.addStartFunction");
			this._startFunctions.push(aFunction);
		};
		
		dbmObject.runTempFunction = function(aFunction) {
			aFunction();
		};
		
		dbmObject.handleLink = function(aUrl, aTarget) {
			return this.singletons.dbmLinkManager.handleLink(aUrl, aTarget);
		};
		
		dbmObject.registerClass = function(aName, aExtends, aFunction) {
			//console.log("dbm.registerClass");
			//console.log(aName, aExtends, aFunction);
			this._classManager.registerClass(aName, aExtends, aFunction);
		};
		
		dbmObject.extendClass = function(aName, aFunction) {
			this._classManager.extendClass(aName, aFunction);
		};
		
		dbmObject.importClass = function(aClassPath) {
			return this._classManager.importClass(aClassPath);
		};
		
		dbmObject.getClass = function(aClassPath) {
			return this._classManager.getClass(aClassPath);
		};
		
		dbmObject.addLibrary = function(aName, aPaths, aEvaluationName, aCssPaths) {
			this._classManager.addLibrary(aName, aPaths, aEvaluationName, aCssPaths);
		};
		
		dbmObject.importLibrary = function(aName, aReInitFunction) {
			//console.log("dbm.importLibrary");
			return this._classManager.importLibrary(aName, aReInitFunction);
		};
		
		dbmObject.setClassAsSingleton = function(aName, aClassPath) {
			//console.log("dbm.setClassAsSingleton");
			//console.log(aName, aClassPath);
			return this._classManager.setClassAsSingleton(aName, aClassPath);
		};
		
		dbmObject.getFileForClass = function(aClassPath) {
			var classesFolder = this._classesFolder;
			for(var objectName in this._specificClassesFolders) {
				if(aClassPath.indexOf(objectName) === 0) {
					classesFolder = this._specificClassesFolders[objectName];
					break;
				}
			}
			
			var fileName = this._javascriptsFolder + "/" + classesFolder + "/" + aClassPath.split(".").join("/") + ".js";
			return fileName;
		};
		
		dbmObject.loadClass = function(aClassPath) {
			
			var fileName = this.getFileForClass(aClassPath);
			this._filesToLoad.push(fileName);
			
			return this;
		};
		
		dbmObject.classRegistered = function(aClassPath) {
			//console.log("dbm.classRegistered");
			//console.log(aClassPath);
			var fileName = this.getFileForClass(aClassPath);
			var currentArray = this._filesToLoad;
			var currentArrayLength = currentArray.length;
			for(var i = this._currentFile+1; i < currentArrayLength; i++) {
				var currentFile = currentArray[i];
				if(currentFile === fileName) {
					currentArray.splice(i, 1);
					break;
				}
			}
		};
		
		dbmObject.loadFile = function(aFilePath) {
			console.log("dbm::loadFile");
			console.log(aFilePath);
			
			var colonPosition = aFilePath.indexOf(":");
			var questionMarkPosition = aFilePath.indexOf("?");
			if(colonPosition !== -1 && (questionMarkPosition === -1 || colonPosition < questionMarkPosition)) {
				this._filesToLoad.push(aFilePath);
			}
			else {
				var fileName = this._javascriptsFolder + "/" + aFilePath;
				this._filesToLoad.push(fileName);
			}
			
			return this;
		};
		
		dbmObject._performLoadFile = function(aFilePath) {
			//console.log("dbm::_performLoadFile");
			//console.log(aFilePath);
			
			this._startupSeed.push(Date.now());
			
			var javascriptFile = new File(aFilePath);
			javascriptFile.open("r");
			var fullText = javascriptFile.read();
			javascriptFile.close();
			
			if(fullText === "") {
				console.log("Couldn't load " + aFilePath);
			}
			
			fullText = fullText.split("this.superCall()").join("arguments.callee.superFunction.call(this)");
			fullText = fullText.split("this.superCall(").join("arguments.callee.superFunction.call(this, ");
			
			try{
				eval(fullText);
			}
			catch(theError) {
				console.log("Couldn't eval " + aFilePath);
			}
			
			this._onFileLoaded();
		};
		
		dbmObject._onFileLoaded = function(aEvent) {
			//console.log("dbm._onFileLoaded");
			dbm._clearCurrentFileLoad();
		};
		
		dbmObject._clearCurrentFileLoad = function() {
			//console.log("dbm._clearCurrentFileLoad");
			this._filesToLoad[this._currentFile] = null;
		};
		
		dbmObject._loadFiles = function() {
			//console.log("dbm::_loadFiles");
			
			while(this._currentFile < this._filesToLoad.length) {
				//console.log(this._currentFile, this._filesToLoad.length);
				//console.log(this._filesToLoad[this._currentFile]);
				this._performLoadFile(this._filesToLoad[this._currentFile]);
				this._currentFile++;
			}
			
			this._start();
		};
		
		dbmObject._start = function() {
			//console.log("dbm::_start");
			
			this._startupSeed.push(Date.now());
			
			this._isStarting = true;
			
			this._classManager.setupClassInheritance();
			this._classManager.setupLibraries();
			this._classManager.setupSingletons();
			
			var currentArray = this._startFunctions;
			var currentArrayLength = currentArray.length;
			
			this._startFunctions = new Array();
			
			for(var i = 0; i < currentArrayLength; i++) {
				currentArray[i].call(this._window);
			}
			
			this._isStarting = false;
			
			if(this._restartAfterStart) {
				this._restartAfterStart = false;
				if(this._currentFile < this._filesToLoad.length) {
					this._loadFiles();
				}
			}
		};
		
		dbmObject.startLoading = function() {
			this._loadFiles();
			
			return this;
		};
		
		dbmObject.restartLoading = function() {
			//console.log("dbm::restartLoading");
			if(this._isStarting) {
				this._restartAfterStart = true;
			}
			else {
				if(this._currentFile < this._filesToLoad.length) {
					this._loadFiles();
				}
			}
			
			return this;
		};
		
		dbmObject.init();
	}
	
	//MENOTE: clear up references
	dbmObject = null;
})(global);