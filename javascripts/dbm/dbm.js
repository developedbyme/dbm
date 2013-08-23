(function(aGlobalObject) {
	//"use strict";
	
	var dbm;
	
	if(aGlobalObject.dbm == undefined) {
		dbm = new (function DBM(){})();
		aGlobalObject.dbm = dbm;
	}
	else {
		dbm = aGlobalObject.dbm;
	}
	
	if(dbm.isCreated != true) {
		dbm.init = function() {
			this.singletons = new Object();
			this.xmlNamespaces = new Object();
			this._specificClassesFolders = new Object();
			this._filesToLoad = new Array();
			this._currentFile = -1;
			this._htmlLoaded = false;
			this._startFunctions = new Array();
			this._classManager = null;
			this._window = null;
			this._document = null;
			this._javascriptsFolder = null;
			this._classesFolder = null;
			this._javascriptVersion = null;
			this.tempClassFunction = null;
			this._currentScriptNode = null;
			
			this._isStarting = false;
			this._restartAfterStart = false;
			
			this.isCreated = true;
			if(Object.seal !== undefined) {
				Object.seal(this);
			}
		};
		
		dbm.getDocument = function() {
			return this._document;
		};
		
		dbm.getWindow = function() {
			return this._window;
		};
		
		dbm.setClassManager = function(aObject) {
			this._classManager = aObject;
		};
		
		dbm.setup = function(aWindow, aDocument, aJavascriptsFolder, aClassesFolder) {
			//console.log("dbm.setup");
			this._window = aWindow;
			this._document = aDocument;
			this._javascriptsFolder = aJavascriptsFolder;
			this._classesFolder = aClassesFolder;
			
			return this;
		};
		
		dbm.addSpecificClassesFolder = function(aClassPathPrefix, aClassesFolder) {
			this._specificClassesFolders[aClassPathPrefix] = aClassesFolder;
			
			return this;
		};
		
		dbm.setupLoaderHook = function() {
			this._document.addEventListener("DOMContentLoaded", this._onHtmlLoaded, false);
			
			return this;
		};
		
		dbm.addStartFunction = function(aFunction) {
			//console.log("dbm.addStartFunction");
			this._startFunctions.push(aFunction);
		};
		
		dbm.runTempFunction = function(aFunction) {
			aFunction();
		};
		
		dbm.handleLink = function(aUrl, aTarget) {
			return this.singletons.dbmLinkManager.handleLink(aUrl, aTarget);
		};
		
		dbm.registerClass = function(aName, aExtends, aFunction) {
			//console.log("dbm.registerClass");
			this._classManager.registerClass(aName, aExtends, aFunction);
		};
		
		dbm.extendClass = function(aName, aFunction) {
			this._classManager.extendClass(aName, aFunction);
		};
		
		dbm.importClass = function(aClassPath) {
			return this._classManager.importClass(aClassPath);
		};
		
		dbm.getClass = function(aClassPath) {
			return this._classManager.getClass(aClassPath);
		};
		
		dbm.addLibrary = function(aName, aPath, aEvaluationName) {
			this._classManager.addLibrary(aName, aPath, aEvaluationName);
		};
		
		dbm.importLibrary = function(aName, aReInitFunction) {
			//console.log("dbm.importLibrary");
			return this._classManager.importLibrary(aName, aReInitFunction);
		};
		
		dbm.setClassAsSingleton = function(aName, aClassPath) {
			return this._classManager.setClassAsSingleton(aName, aClassPath);
		};
		
		dbm.getFileForClass = function(aClassPath) {
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
		
		dbm.loadClass = function(aClassPath) {
			
			var fileName = this.getFileForClass(aClassPath);
			this._filesToLoad.push(fileName);
			
			return this;
		};
		
		dbm.classRegistered = function(aClassPath) {
			//console.log("dbm.classRegistered");
			//console.log(aClassPath);
			var fileName = this.getFileForClass(aClassPath);
			var currentArray = this._filesToLoad;
			var currentArrayLength = currentArray.length;
			for(var i = this._currentFile+1; i < currentArrayLength; i++) {
				var currentFile = currentArray[i];
				if(currentFile == fileName) {
					currentArray.splice(i, 1);
					break;
				}
			}
		};
		
		dbm.loadFile = function(aFilePath) {
			//console.log("dbm::loadFile");
			//console.log(aFilePath);
			
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
		
		dbm._performLoadFile = function(aFilePath) {
			//console.log("dbm::_performLoadFile");
			//console.log(aFilePath);
			
			var scriptTag = document.createElement("script");
			
			var scriptType = "application/javascript";
			if(this._javascriptVersion !== null) {
				scriptType += ";version=" + this._javascriptVersion;
			}
			scriptTag.type = scriptType;
			scriptTag.src = aFilePath;
			scriptTag.async = false;
			
			this._currentScriptNode = scriptTag;
			
			scriptTag.addEventListener("load", dbm._onFileLoaded, false);
			scriptTag.addEventListener("error", dbm._onFileLoaded, false);
			
			var headTags = this._document.getElementsByTagName("head");
			headTags[0].appendChild(scriptTag);
		};
		
		dbm._onHtmlLoaded = function(aEvent) {
			//console.log("dbm._htmlLoaded");
			if(dbm._htmlLoaded) return;
			dbm._htmlLoaded = true;
			
			dbm._loadNextFile();
		};
		
		dbm._onFileLoaded = function(aEvent) {
			dbm._loadNextFile();
		};
		
		dbm._loadNextFile = function() {
			this._currentFile++;
			
			if(this._currentFile >= this._filesToLoad.length) {
				this._start();
			}
			else {
				this._performLoadFile(this._filesToLoad[this._currentFile]);
			}
		};
		
		dbm._start = function() {
			
			this._isStarting = true;
			
			this._classManager.setupClassInheritance();
			this._classManager.setupLibraries();
			this._classManager.setupSingletons();
			
			var currentArray = this._startFunctions;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				currentArray[i].call(window);
			}
			
			this._startFunctions = new Array();
			this._isStarting = false;
			
			if(this._restartAfterStart) {
				this._restartAfterStart = false;
				if(this._currentFile < this._filesToLoad.length) {
					this._performLoadFile(this._filesToLoad[this._currentFile]);
				}
			}
		};
		
		dbm.externalStart = function() {
			this._start();
			
			return this;
		};
		
		dbm.restartLoading = function() {
			//console.log("dbm::restartLoading");
			if(this._isStarting) {
				this._restartAfterStart = true;
			}
			else {
				if(this._currentFile < this._filesToLoad.length) {
					this._performLoadFile(this._filesToLoad[this._currentFile]);
				}
			}
			
			return this;
		}
		
		dbm.init();
	}
})(window);