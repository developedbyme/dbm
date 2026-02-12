import Dbm from "../index.js";

export {default as Item} from "./Item.js";
export {default as Repository} from "./Repository.js";

export const getItem = function(aName) {
    return Dbm.getInstance().repository.getItem(aName);
}

export const getItems = function(aNames) {
    return Dbm.getInstance().repository.getItems(aNames);
}

export const getItemIfExists = function(aName) {
    return Dbm.getInstance().repository.getItemIfExists(aName);
}

export const getValueIfExists = function(aObjectName, aPropertyName) {
    let object = getItemIfExists(aObjectName);
    if(!object) {
        return null;
    }

    return Dbm.objectPath(object, aPropertyName);
}

export const getControllerIfExists = function(aObjectName) {
    return getValueIfExists(aObjectName, "controller");
}