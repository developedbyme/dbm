/**
 * An id group that combines a prefix, number, and suffix to an id.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.idmanager.objects.NormalIdGroup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.idmanager.objects.NormalIdGroup");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.idmanager.objects.NormalIdGroup");
		
		this.prefix = "";
		this.suffix = "";
		this._idNr = 0;
		
		return this;
	}
	
	/**
	 * Returns a new id as a string.
	 *
	 * @return	The id as a string.
	 */
	objectFunctions.getNewId = function() {
		this._idNr++;
		return (this.prefix + this._idNr + this.suffix);
	}
	
	/**
	 * Return a new id as a number.
	 *
	 * @return	The number part for the id.
	 */
	objectFunctions.getNewIdNr = function() {
		this._idNr++;
		return this._idNr;
	}
});