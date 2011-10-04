dbm.runTempFunction(function() {
	
	var classManager = new Object();
	
	classManager.init = function() {
		this._classes = new Object();
		this._currentRegistrationClass = null;
		this._singletons = new Object();
		this._libraries = new Object();
		this._reInitLibraryFunctions = new Array();
		
		return this;
	};
	
	classManager.registerClass = function(aName, aExtends, aFunction) {
		
		this._currentRegistrationClass = aName;
		
		var newClassHolder;
		
		if(this._classes[aName] != undefined) {
			newClassHolder = this._classes[aName];
		}
		else {
			newClassHolder = new Object();
			newClassHolder.name = aName;
			newClassHolder.classFunction = function(){};
		}
		
		newClassHolder.extendedClass = aExtends;
		if(aExtends != null) {
			this.importClass(aExtends);
		}
		newClassHolder.prototypeObject = null;
		newClassHolder.objectMethods = new Object();
		newClassHolder.staticMethods = new Object();
		
		aFunction(newClassHolder.objectMethods, newClassHolder.staticMethods, newClassHolder.classFunction);
		
		this._classes[aName] = newClassHolder;
		
		this._currentRegistrationClass = null;
		
		return newClassHolder;
	};
	
	classManager.importClass = function(aName) {
		
		if(this._classes[aName] != undefined) {
			return this._classes[aName].classFunction;
		}
		
		newClassHolder = new Object();
		newClassHolder.name = aName;
		var className = aName.substring(aName.lastIndexOf(".")+1, aName.length);
		eval("dbm.tempClassFunction = function " + className + "(){};");
		newClassHolder.classFunction = dbm.tempClassFunction;
		dbm.tempClassFunction = null;
		
		this._classes[aName] = newClassHolder;
		
		dbm.loadClass(aName);
		
		return newClassHolder.classFunction;
	};
	
	classManager.addLibrary = function(aName, aPath, aEvaluationName) {
		
		var newLibraryHolder = new Object();
		newLibraryHolder.name = aName;
		newLibraryHolder.evaluationName = aEvaluationName;
		newLibraryHolder.isCreated = false;
		
		this._libraries[aName] = newLibraryHolder;
		
		dbm.loadFile(aPath);
	};
	
	classManager.importLibrary = function(aName, aReInitFunction) {
		//console.log("classManager.importLibrary");
		if(aReInitFunction != null && aReInitFunction != undefined) {
			this.addReInitLibraryFunction(aReInitFunction);
		}
		return this._libraries[aName];
	};
	
	classManager.setupLibraries = function() {
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
	};
	
	classManager.addReInitLibraryFunction = function(aFunction) {
		this._reInitLibraryFunctions.push(aFunction);
	};
	
	classManager.setClassAsSingleton = function(aName, aClassPath) {
		var theClassPath = (aClassPath != null) ? aClassPath : this._currentRegistrationClass;
		
		this._singletons[aName] = theClassPath;
	};
	
	classManager.setupClassInheritance = function() {
		//console.log("classManager.setupClassInheritance");
		for(var objectName in this._classes) {
			this._setupClassInheritanceForClass(objectName);
		}
	};
	
	classManager.setupSingletons = function() {
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
	};
	
	classManager._setupClassInheritanceForClass = function(aName) {
		//console.log("classManager._setupClassInheritanceForClass");
		//console.log(aName);
		
		var currentClassHolder = this._classes[aName];
		if(currentClassHolder.prototypeObject == null) {
			
			if(currentClassHolder.extendedClass != null) {
				
				var extendedClass = this._setupClassInheritanceForClass(currentClassHolder.extendedClass);
				currentClassHolder.prototypeObject = new (extendedClass.classFunction)();
				
				var extendedMethods = extendedClass.prototypeObject;
				for(var extendedMethodName in extendedMethods) {
					currentClassHolder.prototypeObject[extendedMethodName] = extendedMethods[extendedMethodName];
				}
				for(var staticMethodName in extendedClass.staticMethods) {
					if(currentClassHolder.staticMethods[staticMethodName] == undefined) {
						currentClassHolder.staticMethods[staticMethodName] = extendedClass.staticMethods[staticMethodName];
					}
				}
				
			}
			else {
				currentClassHolder.prototypeObject = new Object();
			}
			
			for(var objectMethodName in currentClassHolder.objectMethods) {
				if(currentClassHolder.prototypeObject[objectMethodName] != undefined) {
					currentClassHolder.objectMethods[objectMethodName].superFunction = currentClassHolder.prototypeObject[objectMethodName];
				}
				currentClassHolder.prototypeObject[objectMethodName] = currentClassHolder.objectMethods[objectMethodName];
			}
			
			currentClassHolder.prototypeObject.__className = aName.substring(aName.lastIndexOf(".")+1, aName.length);
			
			currentClassHolder.classFunction.prototype = currentClassHolder.prototypeObject;
			
			
			for(var staticMethodName in currentClassHolder.staticMethods) {
				currentClassHolder.classFunction[staticMethodName] = currentClassHolder.staticMethods[staticMethodName];
			}
		}
		
		return currentClassHolder;
	};
	
	classManager.init();
	dbm.setClassManager(classManager);
});