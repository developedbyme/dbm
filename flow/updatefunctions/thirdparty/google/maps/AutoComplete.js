import Dbm from "../../../../../index.js";

export default class AutoComplete extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("text", "");
        this.input.register("countries", []);
        this.input.register("types", ["geocode"]);
        this.input.register("language", "en");

        this._loadedScript = false;
        this._currentText = "";

        this.output.register("updated", true);
        this.output.register("results", []);
    }

    loadScript() {
        let key = Dbm.getRepositoryItem("googleMapsApi").apiKey;
        let scriptLoader = Dbm.loading.loadScript("https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=places");
        Dbm.flow.runWhenMatched(scriptLoader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._scriptLoaded.bind(this)));

        return this;
    }

    _scriptLoaded() {
        //console.log("_scriptLoaded");
        if(!this._loadedScript) {
            this._loadedScript = true;
            this._update();
        }
    }

    setLanguage(aLanguageCode) {
        this.input.language = aLanguageCode;

        return this;
    }

    setCountryRestrictions(aCountryCode) {
        this.input.countries = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(aCountryCode);

        return this;
    }

    _update() {
        //console.log("_update");

        let text = this.input.text;
        this._currentText = text;
        this.output.updated = false;

        if(text) {
            this.output.properties.results.isDirty = false;
            this.output.properties.updated.isDirty = false;

            if(this._loadedScript) {
                
                let requestData = {
                    input: text,
                    language: this.input.language,
                };

                if(this.input.countries) {
                    requestData["includedRegionCodes"] = this.input.countries;
                }
                if(this.input.types) {
                    requestData["includedPrimaryTypes"] = this.input.types;
                }

                let request = google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(requestData);

                request.then((aResult) => {
                    let suggestions = aResult.suggestions;
                    this._resultsLoaded(text, Dbm.utils.ArrayFunctions.mapField(suggestions, "placePrediction"));
                });
            }
            else {
                this.loadScript();
            }
        }
        else {
            this.output.results = [];
            this.output.updated = true;
        }
        
        
    }

    _getResultDetails(aPlaceId) {

        let place = new google.maps.places.Place({"id": aPlaceId});

        let loadPromise = place.fetchFields({"fields": ["addressComponents"]});

        loadPromise.then((aResult) => {
            //console.log(place);
        })
    }

    _resultsLoaded(aText, aPredictions) {
        console.log("_resultsLoaded");
        /*
        for(let i = 0; i < aPredictions.length; i++) {
            let currentPredition = aPredictions[i];
            
            //console.log(currentPredition.text.text, currentPredition.mainText.text, currentPredition.secondaryText.text, currentPredition.placeId);
            this._getResultDetails(currentPredition.placeId);
            break;
        }
        */

        //console.log(this.isDirty, this.output.properties.results.isDirty, this._currentText, aText);

        if(this._currentText === aText) {
            this.output.properties.results._internal_setValueInFlowOutsideOfUpdate(aPredictions);
            this.output.properties.updated._internal_setValueInFlowOutsideOfUpdate(true);
        }
    }
}



