import Dbm from "../../index.js";

let performMultiply = function(aInput1, aInput2) {
    return aInput1*aInput2;
}

export const multiply = function(aInput1, aInput2) {
    let functionCommand = Dbm.commands.callFunction(aFunction, aArguments);

    return Dbm.core.source.callFunction(performMultiply, [aInput1, aInput2]);
}