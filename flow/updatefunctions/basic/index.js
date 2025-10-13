import Dbm from "../../../index.js";

export {default as RunCommand} from "./RunCommand.js";
export {default as CombineString} from "./CombineString.js";
export {default as Length} from "./Length.js";
export {default as PropertyOf} from "./PropertyOf.js";
export {default as MappedList} from "./MappedList.js";

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

export const mappedList = function(aItems, aNewItemCommands = []) {
	let updateFunction = new Dbm.flow.updatefunctions.basic.MappedList();
	updateFunction.input.properties.items.setOrConnect(aItems);
	updateFunction.input.properties.newItemCommands.setOrConnect(aNewItemCommands);

	return updateFunction;
}

export const mappedListWithFunction = function(aItems, aNewItemFunction) {
	let command = Dbm.commands.callFunction(aNewItemFunction, [Dbm.core.source.event("mappedItem"), Dbm.core.source.fromObject()]);

	return mappedList(aItems, [command]);
}



export const activeMappedList = function(aItems, aActiveFromStart = false) {

	let item = new Dbm.repository.Item();

	item.requireProperty("items", []).setOrConnect(aItems);
	item.requireProperty("activeItems", []);
	item.requireProperty("selectionItems", []);

	let activeItems = new Dbm.flow.controllers.select.InArray();

	let createActiveField = function(aItem, aUpdateFunction) {
		let activeProperty = aItem.requireProperty("active", aUpdateFunction.activeFromStart);
		let inArrayProperty = activeItems.getSelectionForValue(aItem[aUpdateFunction.input.itemReferenceName]);
		inArrayProperty.connectInput(activeProperty);
	}

	let updateFunction = mappedListWithFunction(item.properties.items, createActiveField);
	updateFunction.activeFromStart = aActiveFromStart;
	item.setValue("mappedList", updateFunction);
	item.properties.selectionItems.connectInput(updateFunction.output.properties.items);

	activeItems.item.properties.values.connectInput(item.properties.activeItems);
	item.setValue("inArray", activeItems);

	return item;
}