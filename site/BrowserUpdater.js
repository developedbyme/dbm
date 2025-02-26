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

		let title = Dbm.objectPath(this.item.pageData, "page.title") + this.item.titleSuffix;
		document.title = title;
		document.querySelector('meta[property="og:title"]').setAttribute("content", title);

		let description = Dbm.objectPath(this.item.pageData, "page.meta/description");
		document.querySelector('meta[name="description"]').setAttribute("content", description);
		document.querySelector('meta[property="og:description"]').setAttribute("content", description);

		//METODO: set canonical

		//METODO: set structured data

		window.scrollTo(0, 0);

		this._trackPage(document.location.href);
	}
}