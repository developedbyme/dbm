import Dbm from "../index.js";

export {default as CommandBaseObject} from "./CommandBaseObject.js";
export {default as CallFunction} from "./CallFunction.js";
export {default as ResolvePromise} from "./ResolvePromise.js";


let callScopedFunction = function(aScopeObject, aFunction, aArguments = []) {
    let newCommand = new Dbm.commands.CallFunction();
    newCommand.item.setValue("scopeObject", aScopeObject);
    newCommand.item.setValue("callFunction", aFunction);
    newCommand.item.setValue("callArguments", aArguments);

    return newCommand;
}

export {callScopedFunction};

let callFunction = function(aFunction, aArguments = []) {
    let newCommand = new Dbm.commands.CallFunction();
    newCommand.item.setValue("callFunction", aFunction);
    newCommand.item.setValue("callArguments", aArguments);

    return newCommand;
}

export {callFunction};

let resolvePromise = function(aValue = null) {
    let newCommand = new Dbm.commands.ResolvePromise();
    newCommand.item.setValue("value", aValue);

    return newCommand;
}

export {resolvePromise};