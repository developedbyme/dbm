import Dbm from "../index.js";

export default class GtagTracker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.setValue("tagId", null);
		this.item.setValue("eventNameMap", new Dbm.repository.Item());

		this.item.eventNameMap.setValue("Product list view", "view_item_list");
		this.item.eventNameMap.setValue("Product view", "view_item");
		this.item.eventNameMap.setValue("Added to cart", "add_to_cart");
		this.item.eventNameMap.setValue("View cart", "view_cart");
		this.item.eventNameMap.setValue("Add shipping", "add_shipping_info");
		this.item.eventNameMap.setValue("Purchase", "purchase");
		this.item.eventNameMap.setValue("Checkout started", "begin_checkout");
		this.item.eventNameMap.setValue("Add payment", "add_payment_info");

		this.item.setValue("conversionIds", new Dbm.repository.Item());
    }

	addPurchaseTrackingId(aId) {
		
		this.item.conversionIds.setValue("purchase", aId);

		return this;
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

		this._gtag("config", this.item.tagId, {
			"send_page_view": true
		});
		
		return this;
	}

    startStatisticsTracking() {
		
		return this;
	}
	
	startMarketingTracking() {
		
		return this;
	}
	
	stopTracking() {
		
		return this;
	}

	_getSendData(aData) {
		let sendData = {
			...aData,
			"send_to": this.item.tagId
		}

		return sendData;
	}

    trackEvent(aEventName, aData, aDataStructure = null) {
        console.log("trackEvent");
        console.log(aEventName, aData, aDataStructure);

		let translatedEventName = this.item.eventNameMap[aEventName];
		if(translatedEventName) {
			aEventName = translatedEventName;
			
			this._gtag("event", aEventName, this._getSendData(aData));

			let conversionId = this.item.conversionIds[aEventName];
			if(conversionId) {
				let sendData = this._getSendData(aData);
				sendData["send_to"] += "/" + conversionId;
				this._gtag("event", "conversion", sendData);
			}
		}

		
    }

    trackCurrentPage() {
        this.trackPage(document.location.href, document.title);
    }

    trackPage(aUrl, aTitle = null) {

		let data = {
			page_location: aUrl,
			page_title: aTitle
		};

        this._gtag("event", "page_view", this._getSendData(data));
    }
}