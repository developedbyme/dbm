import Dbm from "../../../../../index.js";

export default class PlaceDetails extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("id", null);
        this.input.register("fields", ["addressComponents", "location"]);

        //reviews

        this._loadedScript = false;
        this._currentId = "";

        this.output.register("updated", true);
        this.output.register("data", null);
    }

    loadScript() {
        console.log("loadScript");
        let key = Dbm.getRepositoryItem("googleMapsApi").apiKey;
        let scriptLoader = Dbm.loading.loadScript("https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=places");
        Dbm.flow.runWhenMatched(scriptLoader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._scriptLoaded.bind(this)));

        return this;
    }

    _scriptLoaded() {
        console.log("_scriptLoaded");
        if(!this._loadedScript) {
            this._loadedScript = true;
            this._update();
        }
    }

    _update() {
        console.log("_update");

        
        let id = this.input.id;
        this._currentId = id;
        this.output.updated = false;

        if(id) {
            this.output.properties.data.isDirty = false;
            this.output.properties.updated.isDirty = false;

            if(this._loadedScript) {

                let place = new google.maps.places.Place({"id": this.input.id});
                console.log(place);

                let loadPromise = place.fetchFields({"fields": this.input.fields});

                loadPromise.then((aResult) => {
                    console.log(id, place, aResult);
                    this.output.properties.data._internal_setValueInFlowOutsideOfUpdate(place);
                })
            }
            else {
                this.loadScript();
            }
        }
        else {
            this.output.data = null;
            this.output.updated = true;
        }
    }
}



