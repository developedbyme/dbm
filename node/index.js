import Dbm from "../index.js";
export * as communication from "./communication/index.js";

export const getDatabase = function() {
    return Dbm.getRepositoryItem("graphDatabase").controller;
}

export const forAll = function(...aPromises) {
    return Promise.all(aPromises);
}
