dbm.runTempFunction(function() {
	dbm.addSpecificClassesFolder("dbm.broadcast", "broadcast/classes", "dbm");
	dbm.addSpecificClassesFolder("dbm.projects.experiments", "experiments/classes", "dbm");
	dbm.addSpecificClassesFolder("dbm.projects.tests", "tests/classes", "dbm");
	dbm.addSpecificClassesFolder("dbm.projects.tools", "tools/classes", "dbm");
	dbm.addSpecificClassesFolder("dbm.projects.examples", "examples/classes", "dbm");
	
	dbm.addLibrary("CodeMirror", ["libraries/codemirror/lib/codemirror.js", "libraries/codemirror/mode/javascript/javascript.js"], "CodeMirror", ["libraries/codemirror/lib/codemirror.css"], "dbm");
});