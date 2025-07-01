import Dbm from "../../../index.js";

export {default as RunCommand} from "./RunCommand.js";
export {default as CombineString} from "./CombineString.js";
export {default as Length} from "./Length.js";
export {default as PropertyOf} from "./PropertyOf.js";

export const runCommand = function(aValue, aCommand) {
	let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
	updateFunction.input.properties.value.setOrConnect(aValue);
	updateFunction.input.properties.command.setOrConnect(aCommand);
	
	return updateFunction;
}

export const transformValue = function(aValue, aFunction) {
	let command = Dbm.commands.callFunction(aFunction, [Dbm.core.source.event()]);
	
	return Dbm.flow.updatefunctions.basic.runCommand(aValue, command);
}

export const length = function(aValue) {
	let updateFunction = new Dbm.flow.updatefunctions.basic.Length();
	updateFunction.input.properties.value.setOrConnect(aValue);
	
	return updateFunction;
}

export const propertyOf = function(aValue, aPropertyName) {
	let updateFunction = new Dbm.flow.updatefunctions.basic.PropertyOf();
	updateFunction.input.properties.value.setOrConnect(aValue);
	updateFunction.input.properties.propertyName.setOrConnect(aPropertyName);
	
	return updateFunction;
}

export const combine = function(...aValues) {
	let updateFunction = new Dbm.flow.updatefunctions.basic.CombineString();
	
	let currentArray = aValues;
	let currentArrayLength = currentArray.length;
	for(let i = 0; i < currentArrayLength; i++) {
		let currentData = currentArray[i];
		updateFunction.addPart(currentData);
	}
	
	
	return updateFunction;
}