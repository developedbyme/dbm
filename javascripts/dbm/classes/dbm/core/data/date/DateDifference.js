/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.data.date.DateDifference", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.date.DateDifference");
	
	var DateDifference = dbm.importClass("dbm.core.data.date.DateDifference");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.date.DateDifference::_init");
		
		this.superCall();
		
		this.years = 0;
		this.months = 0;
		this.days = 0;
		this.hours = 0;
		this.minutes = 0;
		this.seconds = 0;
		
		return this;
	};
	
	objectFunctions.setValues = function(aYears, aMonths, aDays, aHours, aMinutes, aSeconds) {
		//console.log("dbm.core.data.date.DateDifference::setValues");
		
		this.superCall();
		
		this.years = aYears;
		this.months = aMonths;
		this.days = aDays;
		this.hours = aHours;
		this.minutes = aMinutes;
		this.seconds = aSeconds;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("years: " + this.years);
		aReturnArray.push("months: " + this.months);
		aReturnArray.push("days: " + this.days);
		aReturnArray.push("hours: " + this.hours);
		aReturnArray.push("minutes: " + this.minutes);
		aReturnArray.push("seconds: " + this.seconds);
		
	};
	
	staticFunctions.create = function(aYears, aMonths, aDays, aHours, aMinutes, aSeconds) {
		//console.log("dbm.core.data.date.DateDifference::create (static)");
		//console.log(aOldValue, aNewValue);
		var newDateDifference = (new DateDifference()).init();
		newDateDifference.setValues(VariableAliases.valueWithDefault(aYears, 0), VariableAliases.valueWithDefault(aMonths, 0), VariableAliases.valueWithDefault(aDays, 0), VariableAliases.valueWithDefault(aHours, 0), VariableAliases.valueWithDefault(aMinutes, 0), VariableAliases.valueWithDefault(aSeconds, 0));
		
		return newDateDifference;
	};
	
	staticFunctions.createWithoutValues = function() {
		//console.log("dbm.core.data.date.DateDifference::createWithoutValues (static)");
		//console.log(aOldValue, aNewValue);
		var newDateDifference = (new DateDifference()).init();
		
		return newDateDifference;
	};
});