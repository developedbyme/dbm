import Dbm from "../index.js";

export {default as CommandBaseObject} from "./CommandBaseObject.js";
export {default as CallFunction} from "./CallFunction.js";
export {default as SetProperty} from "./SetProperty.js";
export {default as ResolvePromise} from "./ResolvePromise.js";
export {default as TrackEvent} from "./TrackEvent.js";


export const callScopedFunction = function(aScopeObject, aFunction, aArguments = []) {
    let newCommand = new Dbm.commands.CallFunction();
    newCommand.item.setValue("scopeObject", aScopeObject);
    newCommand.item.setValue("callFunction", aFunction);
    newCommand.item.setValue("callArguments", aArguments);

    return newCommand;
}

export const callFunction = function(aFunction, aArguments = []) {
    let newCommand = new Dbm.commands.CallFunction();
    newCommand.item.setValue("callFunction", aFunction);
    newCommand.item.setValue("callArguments", aArguments);

    return newCommand;
}

export const resolvePromise = function(aValue = null) {
    let newCommand = new Dbm.commands.ResolvePromise();
    newCommand.item.setValue("value", aValue);

    return newCommand;
}

export const setProperty = function(aProperty, aValue) {
    let newCommand = new Dbm.commands.SetProperty();
    newCommand.item.setValue("property", aProperty);
    newCommand.item.setValue("value", aValue);

    return newCommand;
}

export const trackEvent = function(aEventName, aAdditionalData = {}) {
    let newCommand = new Dbm.commands.TrackEvent();
    newCommand.item.setValue("eventName", aEventName);
    newCommand.item.setValue("additionalData", aAdditionalData);

    return newCommand;
}

export const performCommands = function(aCommands, aFromObject = null, aEventData = null) {
    let currentArray = aCommands;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentCommand = currentArray[i];
        currentCommand.perform(aFromObject, aEventData);
    }
}