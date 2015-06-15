/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Documentation meta data for a single documentation comment.
 */
dbm.registerClass("dbm.compiler.compiledata.documentation.DocumentationData", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.compiledata.documentation.DocumentationData");
	
	//Self reference
	var DocumentationData = dbm.importClass("dbm.compiler.compiledata.documentation.DocumentationData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var DocumentationFlagData = dbm.importClass("dbm.compiler.compiledata.documentation.DocumentationFlagData");
	
	//Utils
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.compiledata.documentation.DocumentationData::_init");
		
		this.superCall();
		
		this._description = null;
		this._flags = new Array();
		
		return this;
	};
	
	/**
	 * Gets the flags of this documentation.
	 *
	 * @return	Array<DocumentationFlagData>	The flags.
	 */
	objectFunctions.getFlags = function() {
		return this._flags;
	};
	
	/**
	 * Parse the raw documentation code.
	 *
	 * @param	aCode	String	The raw documentation comment.
	 *
	 * @return	self
	 */
	objectFunctions.parseDocumentationCode = function(aCode) {
		//console.log("dbm.compiler.compiledata.documentation.DocumentationData::parseDocumentationCode");
		
		var description = "";
		var lineStartRegExp = new RegExp("^[\\s]*\\/?[\\*]*[\\s]*");
		var lineEndRegExp = new RegExp("[\\s]*[\*]*\\/?[\\s]*$");
		var argumentsSplitRegExp = new RegExp("[\\s]*[\\t]+[\\s]*");
		
		var currentArray = aCode.split("\n");
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLine = currentArray[i];
			
			currentLine = currentLine.replace(lineStartRegExp, "");
			currentLine = currentLine.replace(lineEndRegExp, "");
			
			if(currentLine.length > 0 && currentLine[0] === "@") {
				
				var currentArguments = currentLine.split(argumentsSplitRegExp);
				var currentLineType = currentArguments.shift();
				currentLineType = currentLineType.substring(1, currentLineType.length);
				
				this._flags.push(DocumentationFlagData.create(currentLineType, currentArguments));
			}
			else {
				description += currentLine + "\n";
			}
		}
		
		this._description = StringFunctions.trim(description);
		//console.log(this._description);
		//console.log(this._flags);
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._description = null;
		this._flags = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aCode	String	The raw documentation comment.
	 *
	 * @return	DocumentationData	The newly created instance.
	 */
	staticFunctions.create = function(aCode) {
		var newDocumentationData = (new ClassReference()).init();
		newDocumentationData.parseDocumentationCode(aCode);
		
		return newDocumentationData;
	};
	
	/**
	 * Creates a new instance of this class, without parsing any data.
	 *
	 * @return	DocumentationData	The newly created instance.
	 */
	staticFunctions.createEmpty = function() {
		var newDocumentationData = (new ClassReference()).init();
		
		return newDocumentationData;
	};
});