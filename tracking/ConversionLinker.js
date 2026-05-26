import Dbm from "../index.js";

export default class ConversionLinker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.setValue("linkerDomains", [document.location.host]);
    }
	
	_gtag() {
		window.dataLayer.push(arguments);
		
		return this;
	}

    startTracking() {
		if(!window.dataLayer) {
			window.dataLayer = [];
		}
		
		return this;
	}

    startStatisticsTracking() {
		
		return this;
	}
	
	startMarketingTracking() {
		
		this._gtag("set", "linker", {"domains": this.item.linkerDomains})
		
		return this;
	}
	
	stopTracking() {
		
		
		return this;
	}

    trackEvent(aEventName, aData, aDataStructure = null) {
        
    }

    trackCurrentPage() {
        
    }

    trackPage(aUrl, aTitle = null) {
		
    }
}