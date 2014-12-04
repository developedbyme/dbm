dbm.runTempFunction(function() {
	
	var DbmCompiler = dbm.importClass("dbm.compiler.DbmCompiler");
	
	var CompileData = dbm.importClass("dbm.compiler.compiledata.CompileData");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var SnippetsGenerator = dbm.importClass("dbm.compiler.snippets.SnippetsGenerator");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		var compiler = (new DbmCompiler()).init();
		
		var compileData = CompileData.create();
		
		compileData.addShortVariable("dbm", "dbm");
		
		compileData.addShortVariable("i", "i");
		compileData.addShortVariable("j", "j");
		compileData.addShortVariable("k", "k");
		compileData.addShortVariable("currentArray", "c");
		compileData.addShortVariable("currentArrayLength", "cl");
		compileData.addShortVariable("currentArray2", "c2");
		compileData.addShortVariable("currentArray2Length", "c2l");
		compileData.addShortVariable("currentArray3", "c3");
		compileData.addShortVariable("currentArray3Length", "c3l");
		compileData.addShortVariable("objectFunctions", "p");
		compileData.addShortVariable("staticFunctions", "s");
		compileData.addShortVariable("ClassReference", "C");
		
		compiler.setCompileData(compileData);
		compiler.setNumberOfFilesBeforeImport(3);
		compiler.setNotice("/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */");
		compiler.addFiles("javascripts/dbm/dbm.js", "javascripts/dbm/setup/defaultDocumentSetup.js", "javascripts/dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js", "javascripts/dbm/setup/defaultSetup.js");
		compiler.addScript(SnippetsGenerator.createApplicationStart("dbm.projects.experiments.linearoptionselection.LinearOptionSelectionApplication"));
		compiler.addFiles("javascripts/dbm/setup/compiledStart.js");
		compiler._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(compiler, compiler.compileFiles, []));
		compiler.load();
	});
});