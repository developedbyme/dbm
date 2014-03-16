/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.date.DateFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.date.DateFunctions");
	
	var DateFunctions = dbm.importClass("com.developedbyme.utils.native.date.DateFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var DateDifference = dbm.importClass("com.developedbyme.core.data.date.DateDifference");
	
	staticFunctions._dateDifferenceIsLater = function(aDateArray2, aDateArray1) {
		var theLength = aDateArray2.length;
		for(var i = 0; i < theLength; i++) {
			if(aDateArray2[i] > aDateArray1[i]) {
				return true;
			}
			else if(aDateArray2[i] < aDateArray1[i]) {
				return false;
			}
		}
		return true;
	};
	
	staticFunctions.getNumberOfDaysInMonth = function(aYear, aMonth) {
		switch(aMonth) {
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				return 31;
			case 3:
			case 5:
			case 8:
			case 10:
				return 30;
			case 1:
				if(((aYear % 4) === 0) && (((aYear % 100) !== 0) || ((aYear % 400) === 0))) {
					return 29;
				}
				return 28;
		}
		return -1;
	};
	
	staticFunctions.dateDifference = function(aDate2, aDate1, aReturnObject) {
		//console.log("dateDifference", aDate2, aDate1);
		var returnObject = aReturnObject;
		if(!VariableAliases.isSet(aReturnObject)) {
			returnObject = DateDifference.createWithoutValues();
		}
		
		var multiplier;
		var testDate1;
		var testDate2;
		if(aDate2.valueOf() === aDate1.valueOf()) {
			returnObject.setValues(0, 0, 0, 0, 0, 0);
			
			return returnObject;
		}
		else if(aDate2.valueOf() >= aDate1.valueOf()) {
			testDate1 = aDate1;
			testDate2 = aDate2;
			multiplier = 1;
		}
		else {
			testDate1 = aDate2;
			testDate2 = aDate1;
			multiplier = -1;
		}
		
		var realYearsDifference = testDate2.getFullYear()-testDate1.getFullYear();
		var realMonthsDifference = testDate2.getMonth()-testDate1.getMonth();
		var realDateDifference = testDate2.getDate()-testDate1.getDate();
		var realHoursDifference = testDate2.getHours()-testDate1.getHours();
		var realMinutesDifference = testDate2.getMinutes()-testDate1.getMinutes();
		var realSecondsDifference = testDate2.getSeconds()-testDate1.getSeconds();
		
		var realArray = [realYearsDifference, realMonthsDifference, realDateDifference, realHoursDifference, realMinutesDifference, realSecondsDifference];
		var zeroArray = [1, 0, 0, 0, 0, 0];
		
		var numberOfYearsDifference = 0;
		var numberOfMonthsDifference = 0;
		var numberOfDaysDifference = 0;
		var numberOfHoursDifference = 0;
		var numberOfMinutesDifference = 0;
		var numberOfSecondsDifference = 0;
		
		//Years
		if(realYearsDifference > 1) {
			numberOfYearsDifference = realYearsDifference-1;
			realYearsDifference -= numberOfYearsDifference;
		}
		
		if(ClassReference._dateDifferenceIsLater(realArray, zeroArray)) {
			numberOfYearsDifference++;
			realYearsDifference--;
		}
		
		realArray.shift();
		zeroArray.shift();
		
		//Months
		numberOfMonthsDifference = 12*realYearsDifference+realMonthsDifference;
		
		realArray.shift();
		zeroArray.shift();
		var newRealMonthDifference = 0;
		if(!ClassReference._dateDifferenceIsLater(realArray, zeroArray)) {
			numberOfMonthsDifference--;
			newRealMonthDifference = 1;
		}
		
		realMonthsDifference = newRealMonthDifference;
		realYearsDifference = 0;
		
		//Days
		numberOfDaysDifference = realDateDifference;
		
		var currentYear = testDate2.getFullYear();
		var currentMonth = testDate2.getMonth()-1;
		if(realMonthsDifference > 0) {
			for(var i = 0; i < realMonthsDifference; i++) {
				if(currentMonth === -1) {
					currentYear--;
					currentMonth = 11;
				}
				numberOfDaysDifference += ClassReference.getNumberOfDaysInMonth(currentYear, currentMonth);
				currentMonth--;
			}
		}
		
		realArray.shift();
		zeroArray.shift();
		
		var newRealDateDifference = 0;
		if(!ClassReference._dateDifferenceIsLater(realArray, zeroArray)) {
			numberOfDaysDifference--;
			newRealDateDifference = 1;
		}
		
		realDateDifference = newRealDateDifference;
		realMonthsDifference = 0;
		
		//Hours
		numberOfHoursDifference = 24*realDateDifference+realHoursDifference;
		
		realArray.shift();
		zeroArray.shift();
		
		var newRealHoursDifference = 0;
		if(!ClassReference._dateDifferenceIsLater(realArray, zeroArray)) {
			numberOfHoursDifference--;
			newRealHoursDifference = 1;
		}
		
		realHoursDifference = newRealHoursDifference;
		realDateDifference = 0;
		
		//Minutes
		numberOfMinutesDifference = 60*realHoursDifference+realMinutesDifference;
		
		realArray.shift();
		zeroArray.shift();
		
		var newRealMinutesDifference = 0;
		if(!ClassReference._dateDifferenceIsLater(realArray, zeroArray)) {
			numberOfMinutesDifference--;
			newRealMinutesDifference = 1;
		}
		
		realMinutesDifference = newRealMinutesDifference;
		realHoursDifference = 0;
		
		//Seconds
		numberOfSecondsDifference = 60*realHoursDifference+realSecondsDifference;
		
		//Set return values
		returnObject.setValues(multiplier*numberOfYearsDifference, multiplier*numberOfMonthsDifference, multiplier*numberOfDaysDifference, multiplier*numberOfHoursDifference, multiplier*numberOfMinutesDifference, multiplier*numberOfSecondsDifference);
		
		return returnObject;
	};
});