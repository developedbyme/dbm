import Dbm from "../index.js";
export {default as ScriptLoader} from "./ScriptLoader.js";
export {default as JsonLoader} from "./JsonLoader.js";
export * as LoadingStatus from "./LoadingStatus.js";

export let loadScript = function(aUrl) {

    let loaderName = "loader-" + aUrl;
    let loaderItem = Dbm.getInstance().repository.getItemIfExists(loaderName);
    
    let loader;
    if(!loaderItem) {
        loader = new Dbm.loading.ScriptLoader();
        loader.item.register(loaderName);
        loader.setUrl(aUrl);
    }
    else {
        loader = loaderItem.controller;
    }

    loader.load();

    return loader;
}