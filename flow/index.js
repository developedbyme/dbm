import Dbm from "../index.js";

export {default as FlowBaseObject} from "./FlowBaseObject.js";
export {default as FlowProperty} from "./FlowProperty.js";
export {default as FlowUpdateFunction} from "./FlowUpdateFunction.js";
export {default as UpdateFunctionInputs} from "./UpdateFunctionInputs.js";
export {default as UpdateFunctionOutputs} from "./UpdateFunctionOutputs.js";
export {default as DirtyCommands} from "./DirtyCommands.js";
export {default as FlowPropertyWithExternalInput} from "./FlowPropertyWithExternalInput.js";

export * as updatefunctions from "./updatefunctions/index.js";
export * as controllers from "./controllers/index.js";

export let addUpdateCommand = function(aProperty, aCommand) {
    let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
    updateFunction.input.properties.value.connectInput(aProperty);
    updateFunction.input.command = aCommand;
    updateFunction.noFirstTriggger();
    
    let updatePropertyCommand = Dbm.commands.callFunction(Dbm.getInstance().repository.getItem("propertyUpdater").controller.addSinglePropertyUpdateBound, [Dbm.core.source.staticObject(updateFunction.output.properties.value)]);

    let dirtyCommands = new Dbm.flow.DirtyCommands();
    updateFunction.output.properties.value.connectOutput(dirtyCommands);
    dirtyCommands.commands.push(updatePropertyCommand);

    return {"updateFunction": updateFunction, "dirtyCommands": dirtyCommands};
}

export let addDirectUpdateCommand = function(aProperty, aCommand) {
    let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
    updateFunction.input.properties.value.connectInput(aProperty);
    updateFunction.input.command = aCommand;
    updateFunction.noFirstTriggger();
    
    let updatePropertyCommand = Dbm.commands.callFunction(updateFunction.output.properties.value.updateFlow.bind(updateFunction.output.properties.value), []);

    let dirtyCommands = new Dbm.flow.DirtyCommands();
    updateFunction.output.properties.value.connectOutput(dirtyCommands);
    dirtyCommands.commands.push(updatePropertyCommand);
    
    return {"updateFunction": updateFunction, "dirtyCommands": dirtyCommands};
}

export let addUpdateCommandWhenMatched = function(aProperty, aMatchValue, aCommand) {
	let whenMatched = Dbm.flow.updatefunctions.logic.whenMatched(aProperty, aMatchValue);
	
	let updateData = Dbm.flow.addUpdateCommand(whenMatched.output.properties.value, aCommand);
	
	updateData["whenMatched"] = whenMatched;
	
	return whenMatched;
}

export const animateValue = function(aValue, aTime = 0.5, aEasing = null) {
	
	let returnObject = new Dbm.repository.Item();
	
	returnObject.setValue("time", aTime);
	returnObject.setValue("easing", aEasing);
	
	let inputProperty = returnObject.requireProperty("input");
	inputProperty.setOrConnect(aValue);
	
	let outputProperty = new Dbm.flow.FlowPropertyWithExternalInput();
	outputProperty.value = inputProperty.value;
	
	returnObject._internal_addProperty("output", outputProperty);
	
	let updateCommand = Dbm.flow.addUpdateCommand(inputProperty, Dbm.commands.callFunction(function(aItem) {
		console.log("animate value");
		
		aItem.properties.output.animateValue(aItem.input, aItem.time, aItem.easing);
	}, [returnObject]));
	
	returnObject.setValue("updateCommand", updateCommand);
	
	return returnObject;
}