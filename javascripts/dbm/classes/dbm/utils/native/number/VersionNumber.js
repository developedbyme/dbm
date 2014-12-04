/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.number.VersionNumber", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.number.VersionNumber");
	
	var VersionNumber = dbm.importClass("dbm.utils.native.number.VersionNumber");
	
	staticFunctions.compareVersions = function(aVersion1, aVersion2) {
		//console.log("dbm.utils.native.number.VersionNumber::compareVersions");
		//console.log(aVersion1, aVersion2);
		var versionsArray1 = VersionNumber.getVersionArray(aVersion1);
		var versionsArray2 = VersionNumber.getVersionArray(aVersion2);
		var maxLength = Math.min(versionsArray1.length, versionsArray2.length);
		for(var i = 0; i < maxLength; i++) {
			var version1Number = parseFloat(versionsArray1[i]);
			var version2Number = parseFloat(versionsArray2[i]);
			if(version1Number > version2Number) {
				return 1;
			}
			else if(version1Number < version2Number) {
				return -1;
			}
		}
		if(versionsArray1.length > versionsArray2.length) {
			return 1;
		}
		else if(versionsArray1.length < versionsArray2.length) {
			return -1;
		}
		return 0;
	};
	
	staticFunctions.getVersionArray = function(aVersion) {
		var currentString = aVersion.replace(new RegExp("[^0-9]+", "g"), ",");
		var returnArray = currentString.split(",");
		return returnArray;
	};
});