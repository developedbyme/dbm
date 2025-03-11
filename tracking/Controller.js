import Dbm from "../index.js";
import Cookies from "js-cookie";

export default class Controller extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("trackers", []);
        this.item.setValue("currency", "EUR");

        Dbm.flow.addDirectUpdateCommand(this.item.requireProperty("active", false), Dbm.commands.callFunction(this._updateActiveStatus.bind(this)));

        Dbm.flow.addDirectUpdateCommand(this.item.requireProperty("allowStatistics", false), Dbm.commands.callFunction(this._updateStatisticsTracking.bind(this)));
        Dbm.flow.addDirectUpdateCommand(this.item.requireProperty("allowMarketing", false), Dbm.commands.callFunction(this._updateMarketingTracking.bind(this)));
    }

    addTracker(aItem) {
        //aItem.propertyInput("allowMarketing", this.item.getProperty("allowMarketing"));
        //aItem.propertyInput("allowStatistics", this.item.getProperty("allowStatistics"));

        let trackers = [].concat(this.item.trackers);

        trackers.push(aItem);

        this.item.trackers = trackers;

        if(this.item.active) {
            aItem.controller.startTracking();
            if(this.item.allowStatistics) {
                aItem.controller.startStatisticsTracking();
            }
            if(this.item.allowMarketing) {
                aItem.controller.startMarketingTracking();
            }
        }

        return this;
    }

    setupPermissionsFromCookies() {
		this.item.allowStatistics = Cookies.get("cookie/allowStatistics") === "1";
		this.item.allowMarketing = Cookies.get("cookie/allowMarketing") === "1";
		
		return this;
	}

    start() {
        //console.log("start");
        this.item.active = true;

        return this;
    }

    stop() {
        this.item.active = false;

        return this;
    }

    _updateActiveStatus() {
        //console.log("_updateActiveStatus");
        //console.log(this.item.active);

        let allowStatistics = this.item.allowStatistics;
        let allowMarketing = this.item.allowMarketing;

        let currentArray = this.item.trackers;
        let currentArrayLength = currentArray.length;
        if(this.item.active) {
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTracker = currentArray[i];
                currentTracker.controller.startTracking();
                if(allowStatistics) {
                    currentTracker.controller.startStatisticsTracking();
                    currentTracker.controller.trackCurrentPage();
                }
                if(allowMarketing) {
                    currentTracker.controller.startMarketingTracking();
                }
            }
        }
        else {
            for(let i = 0; i < currentArrayLength; i++) {
                currentArray[i].controller.stopTracking();
            }
        }
    }

    _updateStatisticsTracking() {
        //console.log("_updateStatisticsTracking");
        //console.log(this.item.allowStatistics);

        if(this.item.active && this.item.allowStatistics) {
            let currentArray = this.item.trackers;
            let currentArrayLength = currentArray.length;
            
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTracker = currentArray[i];
                currentTracker.controller.startStatisticsTracking();
                currentTracker.controller.trackCurrentPage();
            }
        }
    }

    _updateMarketingTracking() {
        //console.log("_updateMarketingTracking");
        //console.log(this.item.allowMarketing);

        if(this.item.active && this.item.allowMarketing) {
            let currentArray = this.item.trackers;
            let currentArrayLength = currentArray.length;
            
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTracker = currentArray[i];
                currentTracker.controller.startMarketingTracking();
            }
        }
    }

    trackEvent(aEventName, aData) {
        console.log("trackEvent");
        console.log(aEventName, aData);

        if(this.item.active) {
            let currentArray = this.item.trackers;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                currentArray[i].controller.trackEvent(aEventName, aData);
            }
        }

        return this;
    }

    trackPage(aUrl) {
        if(this.item.active && this.item.allowStatistics) {
            let currentArray = this.item.trackers;
            let currentArrayLength = currentArray.length;
            
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTracker = currentArray[i];
                currentTracker.controller.trackPage(aUrl);
            }
        }
    }

    trackCurrentPage() {
        if(this.item.active && this.item.allowStatistics) {
            let currentArray = this.item.trackers;
            let currentArrayLength = currentArray.length;
            
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTracker = currentArray[i];
                currentTracker.controller.trackCurrentPage();
            }
        }
    }

    _getValueFromItems(aItems) {
        let value = 0;

        let currentArray = aItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];

            let quantity = currentItem.quantity ? currentItem.quantity : 1;
            value += quantity*currentItem.price;
        }

        return value; 
    }

    trackProductView(aProduct) {

        let items = [aProduct];

        let data = {
            currency: this.item.currency,
            value: this._getValueFromItems(items),
            items: items
        }

        this.trackEvent("Product view", data);
    }

    trackAddedToCart(aProductOrProducts) {
        let items = Dbm.utils.ArrayFunctions.singleOrArray(aProductOrProducts);

        let data = {
            currency: this.item.currency,
            value: this._getValueFromItems(items),
            items: items
        }

        this.trackEvent("Added to cart", data);

    }

    trackCheckoutStarted(aProductOrProducts) {
        let items = Dbm.utils.ArrayFunctions.singleOrArray(aProductOrProducts);

        let data = {
            currency: this.item.currency,
            value: this._getValueFromItems(items),
            items: items
        }

        this.trackEvent("Checkout started", data);
    }

    trackPurchase(aTransactionId, aProductOrProducts) {
        let items = Dbm.utils.ArrayFunctions.singleOrArray(aProductOrProducts);

        let data = {
            transaction_id: aTransactionId,
            currency: this.item.currency,
            value: this._getValueFromItems(items),
            items: items
        }

        this.trackEvent("Purchase", data);
    }

    createProductItemData(aId, aName, aPrice, aQuantity = 1, aAddtionalData = {}) {

        let returnObject = {
            ...aAddtionalData,
            id: aId,
            item_id: aId,
            item_name: aName,
            price: aPrice,
            quantity: aQuantity
        }

        return returnObject;
    }
}