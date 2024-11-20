import Dbm from "../index.js";

export {default as Runner} from "./Runner.js";
export {default as Controller} from "./Controller.js";

export let runStartup = function() {
    if(!window.dbmstartup.modules.isSetup) {
        let controller = new Dbm.startup.Controller();

        let currentArray = globalThis.dbmstartup.modules._;

        globalThis.dbmstartup.modules = controller;

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