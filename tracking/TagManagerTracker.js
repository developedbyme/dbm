import Dbm from "../index.js";

export default class TagManagerTracker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.requireProperty("tagManagerId");
		this.item.requireProperty("customDataLayerName");

    }

    loadTagManager() {

		let id = this.item.tagManagerId;

		let url = "https://www.googletagmanager.com/gtm.js?id="+id;
		if(this.item.customDataLayerName) {
			url += "&l=" + this.customDataLayerName;
		}
		Dbm.loading.loadScript(url);
		
		return this;
	}

	startTracking() {

	}

    startStatisticsTracking() {
		console.log("TagManagerTracker::startStatisticsTracking");
		this.loadTagManager();
		
		return this;
	}
	
	startMarketingTracking() {
		
		this.loadTagManager();
		
		return this;
	}

	stopTracking() {
		
	}

	trackEvent(aEventName, aData) {
        
    }

    trackCurrentPage() {
        
    }

    trackPage(aUrl) {
        
    }
}