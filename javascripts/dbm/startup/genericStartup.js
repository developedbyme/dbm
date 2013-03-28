dbm.runTempFunction(function() {
	
	//var scriptElement = document.currentScript; //MENOTE: only works in firefox
	var scriptElements = document.querySelectorAll("script"); //MENOTE: this works as long as the script is not injected before any other script tag
	var scriptElement = scriptElements[scriptElements.length-1];
	if(scriptElement == null) {
		console.error("Generic startup is not available without script tag");
		return;
	}
	
	var htmlPath = document.location.href;
	var scriptPath = scriptElement.src;
	
	var javascriptsFolder = null;
	if(scriptElement.hasAttribute("data-dbm-startup-javascripts-folder")) {
		javascriptsFolder = scriptElement.getAttribute("data-dbm-startup-javascripts-folder");
	}
	else {
		//METODO: setup default folder
		javascriptsFolder = "../javascripts"; //MEDEBUG
	}
	var classesFolder = "classes";
	if(scriptElement.hasAttribute("data-dbm-startup-classes-folder")) {
		classesFolder = scriptElement.getAttribute("data-dbm-startup-classes-folder");
	}
	var setupFiles = ["dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js", "dbm/setup/defaultSetup.js"];
	if(scriptElement.hasAttribute("data-dbm-startup-setup-files")) {
		classesFolder = scriptElement.getAttribute("data-dbm-startup-setup-files").split(",");
	}
	var startFiles = null;
	if(scriptElement.hasAttribute("data-dbm-startup-start-files")) {
		startFiles = scriptElement.getAttribute("data-dbm-startup-start-files").split(",");
	}
	
	dbm.setup(window, document, javascriptsFolder, classesFolder);
	
	var currentArray = setupFiles;
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		var currentFile = currentArray[i];
		dbm.loadFile(currentFile);
	}
	
	var currentArray = startFiles;
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		var currentFile = currentArray[i];
		dbm.loadFile(currentFile);
	}
	
	dbm.setupLoaderHook();
});