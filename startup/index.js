import Dbm from "../index.js";

export {default as Runner} from "./Runner.js";
export {default as Controller} from "./Controller.js";

export const runStartup = function(aGlobalScope = "dbmstartup", aModulesName = "modules") {
    if(!window[aGlobalScope][aModulesName].isSetup) {
        let controller = new Dbm.startup.Controller();

        let currentArray = globalThis[aGlobalScope][aModulesName]._;

        globalThis[aGlobalScope][aModulesName] = controller;

        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            if(currentData) {
                let newRunner = new Dbm.startup.Runner();
                newRunner.setup(currentData["element"], currentData["moduleName"], currentData["data"], i);
                newRunner.start();
            }
        }

        controller._nextId = currentArrayLength+1;

        currentArray.splice(0, currentArrayLength);
    }
}

export const setupLibrary = function() {
    let library = Dbm.getRepositoryItem("library");
    library.setValue("Dbm/commands/CallFunction", Dbm.commands.CallFunction);
    library.setValue("Dbm/flow/addUpdateCommand", Dbm.flow.addUpdateCommand);
    library.setValue("Dbm/flow/addUpdateCommandWhenMatched", Dbm.flow.addUpdateCommandWhenMatched);
}