import Dbm from "../index.js";

export default class MetaPixelTracker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.requireProperty("pixelId")
    }

    _setupFunction() {
		
		if(window.fbq) return;
		
		let fbq = function() {
			fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
		}
		window.fbq = fbq;
		
		if(!window._fbq) {
			window._fbq = fbq;
		}
		
		fbq.push = fbq;
		fbq.loaded = true;
		fbq.version = "2.0";
		fbq.queue = [];
		fbq.disablePushState = true;
		
		return this;
	}

    startTracking() {

		//MENOTE: do nothing
		
		return this;
	}

    startStatisticsTracking() {

		//MENOTE: do nothing
		
		return this;
	}
	
	startMarketingTracking() {

		this._setupFunction();
		Dbm.loading.loadScript("https://connect.facebook.net/en_US/fbevents.js");

		let pixelId = this.item.pixelId;
		
		if(this.item.pixelId) {
			window.fbq("init", this.item.pixelId);
			window.fbq("track", "PageView");
		}
		
		return this;
	}
	
	stopTracking() {
		
		return this;
	}

	_convertGooogleAnalyctisData(aData) {

		let data = {
			content_type: "product",
			value: aData.value,
			currency: aData.currency,
			contents: aData.items,
			num_items: aData.items.length,
			content_ids: Dbm.utils.ArrayFunctions.mapField(aData.items, "id")
		};

		if(aData.items.length === 1) {
			data["content_name"] = aData.items[0]["item_name"];
		}

		return data;
	}

    trackEvent(aEventName, aData) {
        console.log("trackEvent");
        console.log(aEventName, aData);

		if(aEventName === "Purchase") {
			window.fbq('track', 'Purchase', this._convertGooogleAnalyctisData(aData), {eventID: aData.transaction_id});
		}
		else if(aEventName === "Product view") {
			window.fbq('track', 'ViewContent', this._convertGooogleAnalyctisData(aData));
		}
		else if(aEventName === "Added to cart") {
			window.fbq('track', 'AddToCart', this._convertGooogleAnalyctisData(aData));
		}
		else if(aEventName === "Checkout started") {
			window.fbq('track', 'InitiateCheckout', this._convertGooogleAnalyctisData(aData));
		}
		else {
			window.fbq("trackCustom", aEventName, aData);
		}
    }

    trackCurrentPage() {
        window.fbq("track", "PageView");
    }

    trackPage(aUrl) {
        window.fbq("track", "PageView");
    }
}