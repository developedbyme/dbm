dbm.runTempFunction(function() {
	//"use strict";
	
	var classManager = new Object();
	
	classManager.init = function() {
		this._classes = new Object();
		this._currentRegistrationClass = null;
		this._singletons = new Object();
		this._libraries = new Object();
		this._reInitLibraryFunctions = new Array();
		
		this._classHolderClass = function ClassHolder() {};
		
		this._objectMethodsClass = function ObjectFunctions() {};
		//this._objectMethodsClass.prototype.toString = function() {return "[ObjectFunctions]"};
		this._staticMethodsClass = function StaticFunctions() {};
		//this._staticMethodsClass.prototype.toString = function() {return "[StaticFunctions]"};
		
		if(Object.seal !== undefined) {
			Object.seal(this);
		}
		
		return this;
	}; //End function init
	
	classManager._createClassFunction = function _createClassFunction(aName) {
		var className = aName.substring(aName.lastIndexOf(".")+1, aName.length);
		eval("dbm.tempClassFunction = function " + className + "(){};");
		var returnClassFunction = dbm.tempClassFunction;
		dbm.tempClassFunction = null;
		return returnClassFunction;
	}; //End function _createClassFunction
	
	classManager._getClassHolder = function _getClassHolder(aName) {
		
		if(this._classes[aName] != undefined) {
			return this._classes[aName];
		}
		
		var newClassHolder = new (this._classHolderClass)();
		newClassHolder.name = aName;
		newClassHolder.classFunction = this._createClassFunction(aName);
		newClassHolder.extendedClass = null;
		newClassHolder.isRegistered = false;
		newClassHolder.prototypeObject = null;
		newClassHolder.objectMethods = new (this._objectMethodsClass)();
		newClassHolder.staticMethods = new (this._staticMethodsClass)();
		
		if(Object.seal !== undefined) {
			Object.seal(newClassHolder);
		}
		
		this._classes[aName] = newClassHolder;
		
		return newClassHolder;
	}; //End function _getClassHolder
	
	classManager.registerClass = function registerClass(aName, aExtends, aFunction) {
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
		if(aExtends != null) {
			this.importClass(aExtends);
		}
		
		aFunction(newClassHolder.objectMethods, newClassHolder.staticMethods, newClassHolder.classFunction);
		
		this._classes[aName] = newClassHolder;
		
		this._currentRegistrationClass = null;
		
		dbm.classRegistered(aName);
		
		return newClassHolder;
	}; //End function registerClass
	
	classManager.extendClass = function extendClass(aName, aFunction) {
		//console.log("classManager.extendClass");
		//console.log(aName, aExtends);
		
		this._currentRegistrationClass = aName;
		
		var newClassHolder = this._getClassHolder(aName);
		
		aFunction(newClassHolder.objectMethods, newClassHolder.staticMethods, newClassHolder.classFunction);
		
		this._currentRegistrationClass = null;
		
		return newClassHolder;
	}; //End function extendClass
	
	classManager.importClass = function importClass(aName) {
		
		if(this._classes[aName] != undefined) {
			return this._classes[aName].classFunction;
		}
		
		var newClassHolder = this._getClassHolder(aName);
		
		dbm.loadClass(aName);
		
		return newClassHolder.classFunction;
	}; //End function importClass
	
	classManager.getClass = function getClass(aName) {
		
		if(this._classes[aName] != undefined) {
			return this._classes[aName].classFunction;
		}
		
		console.error("Class " + aName + " has not been imported.");
		
		return null;
	}; //End function getClass
	
	classManager.addLibrary = function addLibrary(aName, aPath, aEvaluationName) {
		
		var newLibraryHolder = new Object();
		newLibraryHolder.name = aName;
		newLibraryHolder.evaluationName = aEvaluationName;
		newLibraryHolder.isCreated = false;
		
		this._libraries[aName] = newLibraryHolder;
		
		dbm.loadFile(aPath);
	}; //End function addLibrary
	
	classManager.importLibrary = function importLibrary(aName, aReInitFunction) {
		//console.log("classManager.importLibrary");
		if(aReInitFunction != null && aReInitFunction != undefined) {
			this.addReInitLibraryFunction(aReInitFunction);
		}
		return this._libraries[aName];
	}; //End function importLibrary
	
	classManager.setupLibraries = function setupLibraries() {
		//console.log("classManager.setupLibraries");
		for(var objectName in this._libraries) {
			var currentData = this._libraries[objectName];
			eval("dbm.tempObject = " + currentData.evaluationName + ";");
			currentData.realLibrary = dbm.tempObject;
			dbm.tempObject = null;
			currentData.isCreated = true;
		}
		
		var currentArray = this._reInitLibraryFunctions;
		var currentArrayLength = currentArray.length;
		for(var i  = 0; i < currentArrayLength; i++) {
			var currentFunction = currentArray[i];
			currentFunction.call(null);
		}
		currentArray.splice(0, currentArrayLength);
	}; //End function setupLibraries
	
	classManager.addReInitLibraryFunction = function addReInitLibraryFunction(aFunction) {
		this._reInitLibraryFunctions.push(aFunction);
	}; //End function addReInitLibraryFunction
	
	classManager.setClassAsSingleton = function setClassAsSingleton(aName, aClassPath) {
		var theClassPath = (aClassPath != null) ? aClassPath : this._currentRegistrationClass;
		
		this._singletons[aName] = theClassPath;
		
		var classHolder = this._getClassHolder(theClassPath);
		if(classHolder.prototypeObject == null) {
			classHolder.classFunction._instance = null;
			classHolder.classFunction.getInstance = null;
		}
		else {
			console.log("Class " + theClassPath + " is already initiated. Can't set it as singleton.");
		}
	}; //End function setClassAsSingleton
	
	classManager.setupClassInheritance = function setupClassInheritance() {
		//console.log("classManager.setupClassInheritance");
		for(var objectName in this._classes) {
			this._setupClassInheritanceForClass(objectName);
		}
	}; //End function setupClassInheritance
	
	classManager.setupSingletons = function setupSingletons() {
		//console.log("classManager.setupSingletons");
		for(var objectName in this._singletons) {
			var className = this._singletons[objectName];
			if(this._classes[className] == null) {
				continue;
			}
			var theClass = this._classes[className].classFunction;
			var newObject = (new theClass()).init();
			dbm.singletons[objectName] = newObject;
			theClass._instance = newObject;
			theClass.getInstance = function() {
				return this._instance;
			}
			delete this._singletons[objectName];
		}
	}; //End function setupSingletons
	
	classManager._setupClassInheritanceForClass = function _setupClassInheritanceForClass(aName) {
		//console.log("classManager._setupClassInheritanceForClass");
		//console.log(aName);
		
		var currentClassHolder = this._classes[aName];
		if(currentClassHolder.prototypeObject == null) {
			if(!currentClassHolder.isRegistered) {
				console.error("Class " + currentClassHolder.name + " is not registered");
			}
			
			//console.log(">", currentClassHolder.extendedClass);
			
			var extendPrototypeObject = null;
			
			if(currentClassHolder.extendedClass != null) {
				
				var extendedClass = this._setupClassInheritanceForClass(currentClassHolder.extendedClass);
				extendPrototypeObject = new (extendedClass.classFunction)();
				
				var extendedMethods = extendedClass.prototypeObject;
				for(var extendedMethodName in extendedMethods) {
					//currentClassHolder.prototypeObject[extendedMethodName] = extendedMethods[extendedMethodName];
					if(currentClassHolder.objectMethods[extendedMethodName] != undefined) {
						currentClassHolder.objectMethods[extendedMethodName].superFunction = extendedMethods[extendedMethodName];
					}
				}
				for(var staticMethodName in extendedClass.staticMethods) {
					if(currentClassHolder.staticMethods[staticMethodName] == undefined) {
						//console.log(staticMethodName);
						currentClassHolder.staticMethods[staticMethodName] = extendedClass.staticMethods[staticMethodName];
					}
				}
				
			}
			else {
				extendPrototypeObject = new Object();
			}
			if(Object.freeze !== undefined) {
				Object.freeze(extendPrototypeObject);
			}
			
			var prototypeClass = this._createClassFunction(aName + "Prototype");
			prototypeClass.prototype = extendPrototypeObject;
			currentClassHolder.prototypeObject = new prototypeClass();
			
			for(var objectMethodName in currentClassHolder.objectMethods) {
				//if(currentClassHolder.prototypeObject[objectMethodName] != undefined) {
				//	currentClassHolder.objectMethods[objectMethodName].superFunction = currentClassHolder.prototypeObject[objectMethodName];
				//}
				currentClassHolder.prototypeObject[objectMethodName] = currentClassHolder.objectMethods[objectMethodName];
				delete currentClassHolder.objectMethods[objectMethodName];
			}
			if(Object.seal !== undefined) {
				Object.seal(currentClassHolder.objectMethods);
			}
			
			currentClassHolder.prototypeObject.__className = aName.substring(aName.lastIndexOf(".")+1, aName.length);
			currentClassHolder.prototypeObject.__fullClassName = aName;
			if(Object.seal !== undefined) {
				Object.seal(currentClassHolder.prototypeObject); //MENOTE: this should be freeze but firefox doesn't seem to like that
			}
			
			currentClassHolder.classFunction.prototype = currentClassHolder.prototypeObject;
			
			for(var staticMethodName in currentClassHolder.staticMethods) {
				currentClassHolder.classFunction[staticMethodName] = currentClassHolder.staticMethods[staticMethodName];
				//delete currentClassHolder.staticMethods[staticMethodName]; //MENOTE: this can't be done before subclasses has been setup
			}
			if(Object.seal !== undefined) {
				Object.seal(currentClassHolder.staticMethods);
				Object.seal(currentClassHolder.classFunction);
			}
		}
		
		console.log("-");
		
		return currentClassHolder;
	}; //End function _setupClassInheritanceForClass
	
	classManager.init();
	dbm.setClassManager(classManager);
});