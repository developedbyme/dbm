import Dbm from "../../index.js";

export {default as ModuleCreator} from "./ModuleCreator.js";

export const addModuleCreator = function(aName, aElement) {
    let module = new Dbm.react.modules.ModuleCreator();
    module.setMainElement(aElement);
    module.item.register("moduleCreators/" + aName);

    return module;
}