import Dbm from "../index.js";

export default class BrowserUpdater extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("titleSuffix", "");
        this.item.setValue("pageData", null);

		Dbm.flow.addUpdateCommand(this.item.properties.pageData, Dbm.commands.callFunction(this._pageDataUpdated.bind(this)));
    }

	setTitleSuffix(aSuffix, aDelimiter = " - ") {
		this.item.titleSuffix = aDelimiter + aSuffix;

		return this;
	}

	_trackPage(aUrl) {
		//console.log("_trackPage");
		
		let trackingController = Dbm.getInstance().repository.getItem("trackingController").controller;
		if(trackingController) {
			trackingController.trackPage(aUrl);
		}
	}

	_pageDataUpdated() {
		document.title = Dbm.objectPath(this.item.pageData, "page.title") + this.item.titleSuffix;
		window.scrollTo(0, 0);

		this._trackPage(document.location.href);
	}
}