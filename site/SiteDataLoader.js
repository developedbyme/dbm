import Dbm from "../index.js";

export default class SiteDataLoader extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.setValue("status", 0);
        this.item.setValue("url", null);
		this.item.setValue("currentPage", null);
        
		let urlUpdate = new Dbm.flow.updatefunctions.basic.RunCommand();
		urlUpdate.input.properties.value.connectInput(this.item.properties.url);
		urlUpdate.input.command = Dbm.commands.callFunction(this._loadUrl.bind(this), []);

		urlUpdate.output.properties.value.startUpdating();
    }

	_loadUrl() {
		//console.log("_loadUrl");

		let url = this.item.url;
		if(url != null) {
			let parsedUrl = new URL(url);
			let pathName = parsedUrl.pathname;

			let pageData = Dbm.getInstance().repository.getItem(pathName);
			pageData.setValue("url", url);

			let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
			let request = graphApi.requestUrl(pathName);

			let urlUpdate = new Dbm.flow.updatefunctions.basic.RunCommand();
			urlUpdate.input.properties.value.connectInput(request.properties.status);
			urlUpdate.input.command = Dbm.commands.callFunction(this._pageDataLoaded.bind(this), [pageData, request]);

			this.item.setValue("status", 2);
			urlUpdate.output.properties.value.startUpdating();
		}
		else {
			this.item.currentPage = null;
			this.item.setValue("status", 0);
		}
	}

	_pageDataLoaded(aPageData, aRequest) {
		//console.log("_pageDataLoaded");
		//console.log(aPageData, aRequest, aRequest.status);

		if(aRequest.status === 1) {
			aPageData.setValue("page", aRequest.item);
			aPageData.setValue("canRender", true);

			if(this.item.url === aPageData.url) {
				this.item.currentPage = aPageData;
				this.item.setValue("status", 1);
			}

			//METODO: remove updaters
		}
		
	}
}