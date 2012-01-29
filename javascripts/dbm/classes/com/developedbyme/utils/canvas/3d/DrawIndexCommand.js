dbm.registerClass("com.developedbyme.utils.canvas.3d.DrawIndexCommand", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.DrawIndexCommand");
	
	var DrawIndexCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.DrawIndexCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.DrawIndexCommand::init");
		
		this.superCall();
		
		this.drawType = null;
		this.indexes = null;
		this.numberOfItems = 0;
		
		return this;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.indexes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newDrawIndexCommand = (new ClassReference()).init();
		
		return newDrawIndexCommand;
	};
});