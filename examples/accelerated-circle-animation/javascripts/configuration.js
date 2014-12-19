dbm.runTempFunction(function() {
	
	dbm.setup(window, document, "javascripts", "classes");
	dbm.addBaseFolder("dbm", "../../javascripts");
	
	dbm.addLibrary("CodeMirror", ["../../../javascripts/libraries/codemirror/lib/codemirror.js", "../../../javascripts/libraries/codemirror/mode/javascript/javascript.js"], "CodeMirror", ["../../javascripts/libraries/codemirror/lib/codemirror.css"]);
});