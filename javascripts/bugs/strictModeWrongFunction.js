var testObject = new Object();
var finalObject = null;

(function(aObject) {
	"use strict";
	
	aObject.strictTestFunction = function() {
		console.log("strictTestFunction");
		console.log(arguments);
		console.log(arguments.callee);
		console.log(arguments.callee.caller);
	}
})(testObject);

(function(aObject) {
	
	aObject.nonStrictTestFunction = function() {
		console.log("nonStrictTestFunction");
		console.log(arguments.callee);
		console.log(arguments.callee.caller);
	}
})(testObject);

var createdObject = (function(aObject) {
	"use strict";
	
	var prototypeObject = new Object();
	prototypeObject.strictTestFunction = aObject.strictTestFunction;
	prototypeObject.nonStrictTestFunction = aObject.nonStrictTestFunction;
	
	var newClass = function testClass() {};
	newClass.prototype = prototypeObject;
	
	var newObject = new newClass();
	
	//newObject.nonStrictTestFunction();
	//newObject.strictTestFunction();
	
	return newObject;
})(testObject);

(function(aObject) {
	
	aObject.nonStrictTestFunction();
	aObject.strictTestFunction();
	
})(createdObject);