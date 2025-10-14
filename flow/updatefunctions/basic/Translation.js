import Dbm from "../../../index.js";

export default class Translation extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("translations", {});
        this.input.register("path", null);
        this.input.register("additionalPath", null);
        this.input.register("id", "");
        this.input.register("defaultValue", null);

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let translations = this.input.translations;

        let path = this.input.path;
        let additionalPath = this.input.additionalPath;
        let id = this.input.id;

        while(path) {

            let currentAdditionalPath = additionalPath;
            while(currentAdditionalPath) {

                let currentValue = translations[path + "/" + currentAdditionalPath + "/" + id];
                if(currentValue) {
                    this.output.value = currentValue;
                    return;
                }

                let nextIndex = currentAdditionalPath.lastIndexOf("/");
                if(nextIndex >= 0) {
                    currentAdditionalPath = currentAdditionalPath.substring(0, nextIndex);
                }
                else {
                    currentAdditionalPath = null;
                }
            }

            let currentValue = translations[path + "/" + id];
            if(currentValue) {
                this.output.value = currentValue;
                return;
            }

            let nextIndex = path.lastIndexOf("/");
            if(nextIndex >= 0) {
                path = path.substring(0, nextIndex);
            }
            else {
                path = null;
            }
        }
        
       let currentValue = translations[id];
        if(currentValue) {
            this.output.value = currentValue;
            return;
        }

        //METODO: report missing translation

        this.output.value = this.input.defaultValue;
    }
}