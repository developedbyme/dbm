/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.date.IsoDate", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.date.IsoDate");
	
	//Self reference
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	//Constants
	
	
	staticFunctions.dateFromIsoString = function(aString, aLocalTimeZoneOffset) {
		
		aLocalTimeZoneOffset = VariableAliases.valueWithDefault(aLocalTimeZoneOffset, 0);
		
		var tPosition = aString.indexOf("T");
		var dataArray;
		var timeArray;
		var timeZoneMultiplier = 0;
		var timeZoneMinutes = 0;
		
		if(tPosition === -1) {
			dataArray = aString.split("-");
			timeArray = [0, 0, 0];
		}
		else {
			dataArray = aString.substring(0, tPosition).split("-");
			timeArray = aString.substring(tPosition+1, tPosition+1+8).split(":");
			if(aString.length-(tPosition+1) > 8) {
				timeZoneMultiplier = (aString.charAt(tPosition+1+8) === "+") ? -1 : 1; //MENOTE: if time is ahead, move back the time
				timeZoneMinutes = 60*Number(aString.substring(tPosition+1+8+1, tPosition+1+8+1+2))+Number(aString.substring(tPosition+1+8+1+2, tPosition+1+8+1+2+2));
			}
		}
		var currentDate = new Date(Number(dataArray[0]), Number(dataArray[1])-1, Number(dataArray[2]), Number(timeArray[0]), Number(timeArray[1]), Number(timeArray[2]));
		if(timeZoneMultiplier !== null) {
			currentDate = new Date(currentDate.valueOf()+timeZoneMultiplier*timeZoneMinutes*60*1000-aLocalTimeZoneOffset*60*1000);
		}
		else if(aLocalTimeZoneOffset !== 0) {
			currentDate = new Date(currentDate.valueOf()-aLocalTimeZoneOffset*60*1000);
			
		}
		
		return currentDate;
	};
	
	staticFunctions.getIsoDate = function(aDate) {
		return aDate.getUTCFullYear() + "-" + NumberFunctions.getPaddedNumber(aDate.getUTCMonth()+1, 2) + "-" + NumberFunctions.getPaddedNumber(aDate.getUTCDate()+1, 2);
	};
	
	staticFunctions.getIsoDateAndTime = function(aDate) {
		return ClassReference.getIsoDate(aDate) + "T" + NumberFunctions.getPaddedNumber(aDate.getUTCHours(), 2) + ":" + NumberFunctions.getPaddedNumber(aDate.getUTCMinutes(), 2) + ":" + NumberFunctions.getPaddedNumber(aDate.getUTCSeconds(), 2);
	};
	
	staticFunctions.getCompactIsoDate = function(aDate) {
		return aDate.getUTCFullYear() + "" + NumberFunctions.getPaddedNumber(aDate.getUTCMonth()+1, 2) + "" + NumberFunctions.getPaddedNumber(aDate.getUTCDate()+1, 2);
	};
	
	staticFunctions.getCompactIsoDateAndTime = function(aDate) {
		return ClassReference.getCompactIsoDate(aDate) + "T" + NumberFunctions.getPaddedNumber(aDate.getUTCHours(), 2) + "" + NumberFunctions.getPaddedNumber(aDate.getUTCMinutes(), 2) + "" + NumberFunctions.getPaddedNumber(aDate.getUTCSeconds(), 2);
	};
});