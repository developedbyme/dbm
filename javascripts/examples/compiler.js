dbm.runTempFunction(function() {
	
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	
	dbm.addStartFunction(function() {
		var compiler = (new DbmCompiler()).init();
		compiler.loadForCompile("javascripts/dbm/dbm.js", "javascripts/dbm/setup/defaultDocumentSetup.js", "javascripts/dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js", "javascripts/dbm/setup/defaultSetup.js");
	});
});