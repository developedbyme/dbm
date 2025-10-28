import Dbm from "../../../../../index.js";

export default class PlaceDetailsDetailsFromQuery extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("query", null);
        this.input.register("fields", ["addressComponents", "location"]);

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

        
        let query = this.input.query;
        this._currentQuery = query;
        this.output.updated = false;

        if(query) {
            this.output.properties.data.isDirty = false;
            this.output.properties.updated.isDirty = false;

            if(this._loadedScript) {

                let loadPromise = google.maps.places.Place.searchByText({
                    textQuery: query,
                    fields: this.input.fields,
                });

                loadPromise.then((aResponse) => {
                    let place = aResponse.places[0];
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



