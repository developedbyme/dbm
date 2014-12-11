(function(aGlobalObject) {
	//"use strict";
	
	var dbm;
	
	if(aGlobalObject.dbm === undefined) {
		dbm = new (function DBM(){})();
		aGlobalObject.dbm = dbm;
	}
	else {
		dbm = aGlobalObject.dbm;
	}
	
	if(dbm.isCreated !== true) {
		dbm.init = function() {
			this._environmentName = "nodejs";
			
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
		
		dbm.getEnvironmentName = function() {
			return this._environmentName;
		};
		
		dbm.getDocument = function() {
			return this._document;
		};
		
		dbm.getWindow = function() {
			return this._window;
		};
		
		dbm.getStartupSeed = function() {
			return this._startupSeed;
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
			
			var fileName = this._javascriptsFolder + "/" + classesFolder + "/" + aClassPath.split(".").join("/");
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
				if(currentFile === fileName) {
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
				var fileName = this._javascriptsFolder + "/" + aFilePath + ".js";
				this._filesToLoad.push(fileName);
			}
			
			return this;
		};
		
		dbm._performLoadFile = function(aFilePath) {
			//console.log("dbm::_performLoadFile");
			//console.log(aFilePath);
			
			require(aFilePath);
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
			
			this._classManager.setupLibraries();
			this._classManager.setupSingletons();
			
			var currentArray = this._startFunctions;
			var currentArrayLength = currentArray.length;
			this._startFunctions = new Array();
			
			for(var i = 0; i < currentArrayLength; i++) {
				currentArray[i].call(null);
			}
			
			this._isStarting = false;
			
			if(this._restartAfterStart) {
				this._restartAfterStart = false;
				if(this._currentFile < this._filesToLoad.length) {
					this._performLoadFile(this._filesToLoad[this._currentFile]);
				}
			}
		};
		
		dbm.startLoading = function() {
			this._loadNextFile();
			
			return this;
		};
		
		dbm.restartLoading = function() {
			//console.log("dbm::restartLoading");
			//console.log(this._isStarting);
			
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
})(global);