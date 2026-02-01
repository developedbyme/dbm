import Dbm from "../../index.js";

export {default as RangeLoader} from "./RangeLoader.js";
export {default as DataLoader} from "./DataLoader.js";

export const createDataLoader = function(aType, aBody = {}) {
    let newLoader = new Dbm.loading.graphapi.DataLoader();
    newLoader.setType(aType);
    newLoader.setBody(aBody);

    return newLoader;
}