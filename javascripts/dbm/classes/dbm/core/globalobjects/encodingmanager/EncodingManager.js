/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.encodingmanager.EncodingManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.encodingmanager.EncodingManager");
	
	var EncodingManager = dbm.importClass("dbm.core.globalobjects.encodingmanager.EncodingManager");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.encodingmanager.EncodingManager::_init");
		
		this.superCall();
		
		this._encoders = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions.addEncoder = function(aEncoderName, aEncoder) {
		this._encoders.addObject(aEncoderName, aEncoder);
	};
	
	objectFunctions.encode = function(aEncoderName, aKey, aValue) {
		if(this._encoders.select(aEncoderName)) {
			var currentEncoder = this._encoders.currentSelectedItem;
			var returnValue = currentEncoder.setKey(aKey).setValue(aValue).encode();
			currentEncoder.reset();
			return returnValue;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "encode", "No encoder with name " + aEncoderName + " exists.");
		return null;
	};
});