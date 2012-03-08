dbm.registerClass("com.developedbyme.flow.compiler.FlowCompiler", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.compiler.FlowCompiler");
	//"use strict";
	
	var FlowCompiler = dbm.importClass("com.developedbyme.flow.compiler.FlowCompiler");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.compiler.FlowCompiler::_init");
		
		this.superCall();
		
		this._propertyIds = NamedArray.create(true);
		
		//console.log("//com.developedbyme.flow.compiler.FlowCompiler::_init");
		return this;
	};
	
	objectFunctions.compileGroup = function(aFlowGroup) {
		
	};
	
	/**
	 * Performs the destruction of this class.
	 */
	objectFunctions.performDestroy = function() {
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.flow.compiler.FlowCompiler::create (static)");
		var newFlowCompiler = (new ClassReference()).init();
		return newFlowCompiler;
	}
});