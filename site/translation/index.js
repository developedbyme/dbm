import Dbm from "../../index.js";

export {default as TranslationLoader} from "./TranslationLoader.js";

export const setupTranslationLoader = function(aUrlBase = "/assets/translations/") {

    Dbm.getRepositoryItem("site/translations").requireProperty("data", {});

    let controller = new Dbm.site.translation.TranslationLoader();
    controller.item.register("site/translationLoader");

    controller.item.setValue("baseUrl", aUrlBase);

    controller.item.properties.language.connectInput(Dbm.getRepositoryItem("site").properties.currentLanguage);

    return controller;
}

export const getLanguage = function(aLanguageCode) {
    let item = Dbm.getRepositoryItem("languages/" + aLanguageCode);

    if(!item.code) {
        item.setValue("code", aLanguageCode);
    }

    return item;
}