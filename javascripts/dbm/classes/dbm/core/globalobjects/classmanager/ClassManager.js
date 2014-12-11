dbm.runTempFunction(function() {
	//"use strict";
	
	var classManager = new (function ClassManager(){})();
	
	classManager.init = function() {
		this._classes = new Object();
		this._currentRegistrationClasses = new Array();
		this._currentRegistrationClass = null;
		this._singletons = new Object();
		this._libraries = new Object();
		this._reInitLibraryFunctions = new Array();
		this._classesWaitingSetup = new Array();
		
		this._classHolderClass = this._createClassFunction("ClassHolder");
		
		this._objectMethodsClass = this._createClassFunction("ObjectFunctions");
		//this._objectMethodsClass.prototype.toString = function() {return "[ObjectFunctions]"};
		this._staticMethodsClass = this._createClassFunction("StaticFunctions");
		//this._staticMethodsClass.prototype.toString = function() {return "[StaticFunctions]"};
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(this);
		//}
		
		return this;
	}; //End function init
	
	classManager._createClassFunction = function(aName) {
		//console.log(aName);
		
		/*
		return function() {};
		*/
		
		var className = aName.substring(aName.lastIndexOf(".")+1, aName.length);
		
		var generateFunction = new Function("return function " + className + "(){};");
		return generateFunction();
		
	}; //End function _createClassFunction
	
	classManager._getClassHolder = function(aName) {
		
		if(this._classes[aName] !== undefined) {
			return this._classes[aName];
		}
		
		var newClassHolder = new (this._classHolderClass)();
		newClassHolder.name = aName;
		newClassHolder.classFunction = this._createClassFunction(aName);
		newClassHolder.extendedClass = null;
		newClassHolder.isRegistered = false;
		newClassHolder.isSetup = false;
		newClassHolder.prototypeObject = null;
		newClassHolder.objectMethods = new (this._objectMethodsClass)();
		newClassHolder.staticMethods = new (this._staticMethodsClass)();
		newClassHolder.dependencies = new Array();
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(newClassHolder);
		//}
		
		this._classes[aName] = newClassHolder;
		
		return newClassHolder;
	}; //End function _getClassHolder
	
	classManager.registerClass = function(aName, aExtends, aFunction) {
		//console.log("classManager.registerClass");
		//console.log(aName, aExtends);
		
		this._currentRegistrationClass = aName;
		
		var newClassHolder = this._getClassHolder(aName);
		
		if(newClassHolder.isRegistered) {
			console.error("Class " + aName + " is already registered.");
			return newClassHolder;
		}
		newClassHolder.isRegistered = true;
		
		newClassHolder.extendedClass = aExtends;
		if(aExtends !== null) {
			this.importClass(aExtends);
		}
		
		aFunction(newClassHolder.objectMethods, newClassHolder.staticMethods, newClassHolder.classFunction);
		
		this._classes[aName] = newClassHolder;
		
		this._currentRegistrationClass = null;
		
		this._setupClassInheritanceForClassIfDependenciesAreReady(newClassHolder);
		dbm.classRegistered(aName, newClassHolder.dependencies);
		
		return newClassHolder;
	}; //End function registerClass
	
	classManager.importClass = function(aName) {
		//console.log("classManager.importClass");
		//console.log(aName);
		
		if(this._currentRegistrationClass !== null) {
			var importingClassHolder = this._getClassHolder(this._currentRegistrationClass);
			importingClassHolder.dependencies.push(aName);
		}
		
		if(this._classes[aName] !== undefined) {
			return this._classes[aName].classFunction;
		}
		
		var newClassHolder = this._getClassHolder(aName);
		
		dbm.loadClass(aName);
		
		return newClassHolder.classFunction;
	}; //End function importClass
	
	classManager.getClassIfExists = function(aName) {
		if(this._classes[aName] !== undefined && this._classes[aName].isRegistered) {
			return this._classes[aName].classFunction;
		}
		
		return null;
	}; //End function getClassIfExists
	
	classManager.getClass = function(aName) {
		
		var theClass = this.getClassIfExists(aName);
		
		if(theClass === null) {
			console.error("Class " + aName + " has not been imported.");
		}
		
		return theClass;
	}; //End function getClass
	
	classManager.addLibrary = function(aName, aPaths, aEvaluationName, aCssPaths) {
		
		var newLibraryHolder = new Object();
		newLibraryHolder.paths = aPaths;
		newLibraryHolder.name = aName;
		newLibraryHolder.evaluationName = aEvaluationName;
		newLibraryHolder.isAdded = false;
		newLibraryHolder.isCreated = false;
		newLibraryHolder.cssPaths = aCssPaths;
		newLibraryHolder.realLibrary = null;
		
		this._libraries[aName] = newLibraryHolder;
	}; //End function addLibrary
	
	classManager.importLibrary = function(aName, aReInitFunction) {
		//console.log("classManager.importLibrary");
		
		var currentLibrary = this._libraries[aName];
		if(currentLibrary === undefined) {
			console.warn("Library " + aName + " is not added. Can't use.");
			return null;
		}
		
		if(aReInitFunction !== null && aReInitFunction !== undefined) {
			this.addReInitLibraryFunction(aReInitFunction);
		}
		
		if(!currentLibrary.isAdded) {
			currentLibrary.isAdded = true;
			
			var currentArray = currentLibrary.paths;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				dbm.loadFile(currentArray[i]);
			}
			
			var theDocument = dbm.getDocument();
			var currentArray = currentLibrary.cssPaths;
			if(currentArray !== null && currentArray !== undefined) {
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var cssPath = currentArray[i];
					
					var newElement = theDocument.createElement("link");
					newElement.setAttribute("rel", "stylesheet");
					newElement.setAttribute("type", "text/css");
					newElement.setAttribute("href", cssPath);
					theDocument.querySelector("head").appendChild(newElement);
				}
			}
		}
		
		return currentLibrary;
	}; //End function importLibrary
	
	classManager.setupLibraries = function() {
		//console.log("classManager.setupLibraries");
		for(var objectName in this._libraries) {
			var currentData = this._libraries[objectName];
			if(currentData.isAdded) {
				eval("dbm.tempObject = " + currentData.evaluationName + ";");
				currentData.realLibrary = dbm.tempObject;
				dbm.tempObject = null;
				currentData.isCreated = true;
			}
		}
		
		var currentArray = this._reInitLibraryFunctions;
		var currentArrayLength = currentArray.length;
		for(var i  = 0; i < currentArrayLength; i++) {
			var currentFunction = currentArray[i];
			currentFunction.call(null);
		}
		currentArray.splice(0, currentArrayLength);
	}; //End function setupLibraries
	
	classManager.addReInitLibraryFunction = function(aFunction) {
		this._reInitLibraryFunctions.push(aFunction);
	}; //End function addReInitLibraryFunction
	
	classManager.setClassAsSingleton = function(aName, aClassPath) {
		var theClassPath = (aClassPath !== null && aClassPath !== undefined) ? aClassPath : this._currentRegistrationClass;
		
		this._singletons[aName] = theClassPath;
		
		var classHolder = this._getClassHolder(theClassPath);
		if(classHolder.prototypeObject === null) {
			classHolder.classFunction._instance = null;
			classHolder.classFunction.getInstance = null;
		}
		else {
			console.warn("Class " + theClassPath + " is already initiated. Can't set it as singleton.");
		}
	}; //End function setClassAsSingleton
	
	classManager.setupSingletons = function() {
		//console.log("classManager.setupSingletons");
		for(var objectName in this._singletons) {
			var className = this._singletons[objectName];
			if(this._classes[className] === null) {
				continue;
			}
			var theClass = this._classes[className].classFunction;
			var newObject = (new theClass()).init();
			dbm.singletons[objectName] = newObject;
			theClass._instance = newObject;
			theClass.getInstance = function() {
				return this._instance;
			};
			delete this._singletons[objectName];
		}
	}; //End function setupSingletons
	
	classManager._setupClassInheritanceForClassIfDependenciesAreReady = function(aClassHolder) {
		//console.log("classManager._setupClassInheritanceForClassIfDependenciesAreReady");
		//console.log(aClassHolder);
		
		if(aClassHolder.prototypeObject === null) {
			if(aClassHolder.extendedClass !== null) {
				var extendedClassHolder = this._getClassHolder(aClassHolder.extendedClass);
				if(extendedClassHolder.isSetup) {
					this._setupFunctionsForClass(aClassHolder, extendedClassHolder);
					this._setupDependentClasses(aClassHolder);
				}
				else {
					this._classesWaitingSetup.push(aClassHolder);
				}
			}
			else {
				this._setupFunctionsForClass(aClassHolder, null);
				this._setupDependentClasses(aClassHolder);
			}
		}
	}; //End function _setupClassInheritanceForClassIfDependenciesAreReady
	
	classManager._setupDependentClasses = function(aClassHolder) {
		//console.log("classManager._setupDependentClasses");
		var currentName = aClassHolder.name;
		
		var dependentClasses = new Array();
		var currentArray = this._classesWaitingSetup;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.extendedClass === currentName) {
				dependentClasses.push(currentObject);
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		var currentArray = dependentClasses;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._setupFunctionsForClass(currentArray[i], aClassHolder);
			this._setupDependentClasses(currentArray[i]);
		}
	};
	
	classManager._setupFunctionsForClass = function(aClassHolder, aExtendsClassHolder) {
		//console.log("classManager._setupFunctionsForClass");
		//console.log(aClassHolder, aExtendsClassHolder);
		
		var currentClassHolder = aClassHolder;
		
		
		var extendPrototypeObject = null;
		
		if(aExtendsClassHolder !== null) {
			
			var extendedClass = aExtendsClassHolder;
			extendPrototypeObject = new (extendedClass.classFunction)();
			
			var extendedMethods = extendedClass.prototypeObject;
			for(var extendedMethodName in extendedMethods) {
				//currentClassHolder.prototypeObject[extendedMethodName] = extendedMethods[extendedMethodName];
				if(currentClassHolder.objectMethods[extendedMethodName] !== undefined) {
					currentClassHolder.objectMethods[extendedMethodName].superFunction = extendedMethods[extendedMethodName];
				}
			}
			for(var staticMethodName in extendedClass.staticMethods) {
				if(currentClassHolder.staticMethods[staticMethodName] === undefined) {
					//console.log(staticMethodName);
					currentClassHolder.staticMethods[staticMethodName] = extendedClass.staticMethods[staticMethodName];
				}
			}
			
		}
		else {
			extendPrototypeObject = new Object();
		}
		
		
		var className = currentClassHolder.name;
		
		var prototypeClass = this._createClassFunction(className + "Prototype");
		prototypeClass.prototype = extendPrototypeObject;
		currentClassHolder.prototypeObject = new prototypeClass();
		
		for(var objectMethodName in currentClassHolder.objectMethods) {
			//if(currentClassHolder.prototypeObject[objectMethodName] !== undefined) {
			//	currentClassHolder.objectMethods[objectMethodName].superFunction = currentClassHolder.prototypeObject[objectMethodName];
			//}
			currentClassHolder.prototypeObject[objectMethodName] = currentClassHolder.objectMethods[objectMethodName];
			delete currentClassHolder.objectMethods[objectMethodName];
		}
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(currentClassHolder.objectMethods);
		//}
		
		currentClassHolder.prototypeObject.__className = className.substring(className.lastIndexOf(".")+1, className.length);
		currentClassHolder.prototypeObject.__fullClassName = className;
		currentClassHolder.prototypeObject.__objectPool = null;
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(currentClassHolder.prototypeObject); //MENOTE: this should be freeze but firefox doesn't seem to like that
		//}
		
		currentClassHolder.classFunction.prototype = currentClassHolder.prototypeObject;
		
		for(var staticMethodName in currentClassHolder.staticMethods) {
			currentClassHolder.classFunction[staticMethodName] = currentClassHolder.staticMethods[staticMethodName];
			//delete currentClassHolder.staticMethods[staticMethodName]; //MENOTE: this can't be done before subclasses has been setup
		}
		
		currentClassHolder.classFunction.__fullClassName = className;
		currentClassHolder.classFunction.__objectPool = null;
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(currentClassHolder.staticMethods);
		//	Object.seal(currentClassHolder.classFunction);
		//}
		
		currentClassHolder.isSetup = true;
	};
	
	classManager.setObjectPoolForClass = function(aName, aObjectPool) {
		var currentClassHolder = this._classes[aName];
		if(currentClassHolder) {
			currentClassHolder.prototypeObject.__objectPool = aObjectPool;
			currentClassHolder.classFunction.__objectPool = aObjectPool;
		}
	}; //End function _setupObjectPoolForClass
	
	classManager.init();
	dbm.setClassManager(classManager);
	
	//MENOTE: clear up references
	classManager = null;
	arguments = null;
});