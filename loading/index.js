import Dbm from "../index.js";

export {default as ScriptLoader} from "./ScriptLoader.js";
export {default as JsonLoader} from "./JsonLoader.js";
export {default as ImageLoader} from "./ImageLoader.js";
export {default as LoadingSequence} from "./LoadingSequence.js";
export {default as FontLoader} from "./FontLoader.js";

export * as LoadingStatus from "./LoadingStatus.js";

export * as node from "./node/index.js";
export * as graphapi from "./graphapi/index.js";

export const loadScript = function(aUrl) {

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

export const getImageLoader = function(aUrl) {
    let loaderName = "imageLoader-" + aUrl;
    let loaderItem = Dbm.getInstance().repository.getItemIfExists(loaderName);
    
    let loader;
    if(!loaderItem) {
        loader = new Dbm.loading.ImageLoader();
        loader.item.register(loaderName);
        loader.setUrl(aUrl);
    }
    else {
        loader = loaderItem.controller;
    }

    return loader;
}

export const loadImage = function(aUrl) {
    
    let loader = getImageLoader(aUrl);
    loader.load();

    return loader;
}

export const loadFont = function(aUrl, aFontName) {
    let loaderName = "loader-" + aUrl;
    let loaderItem = Dbm.getInstance().repository.getItemIfExists(loaderName);
    
    let loader;
    if(!loaderItem) {
        loader = new Dbm.loading.FontLoader();
        loader.item.register(loaderName);
        loader.setUrl(aUrl);
        loader.setFontName(aFontName);
    }
    else {
        loader = loaderItem.controller;
    }

    loader.load();

    return loader;
}