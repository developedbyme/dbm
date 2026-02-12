import Dbm from "../index.js";

export default class DataLayerTracker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this._statisticsTracking = false;
		this._marketingTracking = false;

		this.item.setValue("ecommerceDataWrapper", null);
		this.item.setValue("eventNameMap", new Dbm.repository.Item());
    }

    addToDataLayer(aData) {
		
		window.dataLayer.push(aData);
		
		return this;
	}
	
	_gtag() {
		window.dataLayer.push(arguments);
		
		return this;
	}

    startTracking() {
		if(!window.dataLayer) {
			window.dataLayer = [];
		}
		
		this._gtag("consent", "default", {
			"ad_storage": "denied",
			"ad_user_data": "denied",
			"ad_personalization": "denied",
			"analytics_storage": "denied"
		});
		
		return this;
	}

    startStatisticsTracking() {
		
		this._statisticsTracking = true;
		this._gtag("consent", "update", {
			"analytics_storage": "granted"
		});
        this.addToDataLayer({"event": "enableStatistics"});
		this.addToDataLayer({"event": "trackCurrentPage"});
		
		return this;
	}
	
	startMarketingTracking() {
		
		this._marketingTracking = true;
		this._gtag("consent", "update", {
			"ad_storage": "granted",
			"ad_user_data": "granted",
			"ad_personalization": "granted"
		});
        this.addToDataLayer({"event": "enableMarketing"});
		
		return this;
	}
	
	stopTracking() {
		this.addToDataLayer({"event": "stopTracking"});
		
		return this;
	}

    trackEvent(aEventName, aData, aDataStructure = null) {
        console.log("trackEvent");
        console.log(aEventName, aData, aDataStructure);

		let translatedEventName = this.item.eventNameMap[aEventName];
		if(translatedEventName) {
			aEventName = translatedEventName;
		}

		if(this._statisticsTracking) {
			this.addToDataLayer({"event": "trackEvent", "value": {"name": aEventName, "data": aData}});
			if(aDataStructure === "raw") {
				let adjustedData = {
					...aData,
					"event": aEventName
				}

				this.addToDataLayer(adjustedData);
			}
			else if(aDataStructure === "ecommerce" && this.item.ecommerceDataWrapper) {
				this.addToDataLayer({"event": aEventName, [this.item.ecommerceDataWrapper]: aData});
			}
			else {
				this._gtag("event", aEventName, aData);
			}
			
		}

        if(this._marketingTracking) {
			this.addToDataLayer({"event": "trackMarketingEvent", "value": {"name": aEventName, "data": aData}});
			if(aDataStructure === "raw") {
				let adjustedData = {
					...aData,
					"event": "Marketing / " + aEventName
				}

				this.addToDataLayer(adjustedData);
			}
			else if(aDataStructure === "ecommerce" && this.item.ecommerceDataWrapper) {
				this.addToDataLayer({"event": "Marketing / " + aEventName, [this.item.ecommerceDataWrapper]: aData});
			}
			else {
				this._gtag("event", "Marketing / " + aEventName, aData);
			}
		}
    }

    trackCurrentPage() {
        this.trackPage(document.location.href);
    }

    trackPage(aUrl) {
        this.addToDataLayer({"event": "trackPage", "value": {"url": aUrl}});
    }
}