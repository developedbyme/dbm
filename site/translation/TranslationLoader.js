import Dbm from "../../index.js";

export default class TranslationLoader extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("language", null);
        this.item.setValue("baseUrl", "/assets/translations/");
        this.item.setValue("ready", false);

        Dbm.flow.addUpdateCommand(this.item.properties.language, Dbm.commands.callFunction(this._loadTranslation.bind(this), []));
    }

    _loadTranslation() {
        console.log("_loadTranslation");

        let language = this.item.language;

        if(language) {
            if(language.translations) {
                this._updateTranslationManager();
            }
            else {
                let baseUrl = this.item.baseUrl;
                
                let fullUrl = baseUrl + language.code + ".json?version=" + Dbm.getRepositoryItem("site").version;

                let loader = new Dbm.loading.JsonLoader();
                loader.setUrl(fullUrl);
                Dbm.flow.addUpdateCommandWhenMatched(loader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._translationLoaded.bind(this), [language, loader]));
                this.item.ready = false;
                loader.load();
            }
        }
        else {
            Dbm.getRepositoryItem("site/translations").setValue("data", {});
            this.item.ready = true;
        }
    }

    _translationLoaded(aLanguage, aLoader) {
        console.log("_translationLoaded");
        console.log(aLanguage, aLoader);

        let data = aLoader.item.data;
        aLanguage.setValue("translations", data);

        if(aLanguage === this.item.language) {
            this._updateTranslationManager();
        }
    }

    _updateTranslationManager() {

        Dbm.getRepositoryItem("site/translations").setValue("data", this.item.language.translations);

        this.item.ready = true;
    }
}