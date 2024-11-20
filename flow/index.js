import Dbm from "../index.js";

export {default as FlowBaseObject} from "./FlowBaseObject.js";
export {default as FlowProperty} from "./FlowProperty.js";
export {default as FlowUpdateFunction} from "./FlowUpdateFunction.js";
export {default as UpdateFunctionInputs} from "./UpdateFunctionInputs.js";
export {default as UpdateFunctionOutputs} from "./UpdateFunctionOutputs.js";
export {default as DirtyCommands} from "./DirtyCommands.js";

export * as updatefunctions from "./updatefunctions/index.js";

export let addUpdateCommand = function(aProperty, aCommand) {
    let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
    updateFunction.input.properties.value.connectInput(aProperty);
    updateFunction.input.command = aCommand;
    updateFunction.noFirstTriggger();
    
    let updatePropertyCommand = Dbm.commands.callFunction(Dbm.getInstance().repository.getItem("propertyUpdater").controller.addSinglePropertyUpdateBound, [updateFunction.output.properties.value]);

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