import Dbm from "../index.js";

export default class SiteDataLoader extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
        this.item.setValue("url", null);
		this.item.setValue("currentPage", null);

		Dbm.flow.addUpdateCommand(this.item.properties.url, Dbm.commands.callFunction(this._loadUrl.bind(this), []));
    }

	_loadUrl() {
		//console.log("_loadUrl");

		let url = this.item.url;
		if(url != null) {
			let parsedUrl = new URL(url);
			let pathName = parsedUrl.pathname;

			let pageData = Dbm.getRepositoryItem(pathName);
			pageData.setValue("url", url);

			let request = Dbm.getGraphApi().requestUrl(pathName);

			this.item.setValue("status", Dbm.loading.LoadingStatus.LOADING);
			Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._pageDataLoaded.bind(this), [pageData, request]))

		}
		else {
			this.item.currentPage = null;
			this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
		}
	}

	_pageDataLoaded(aPageData, aRequest) {
		//console.log("_pageDataLoaded");
		//console.log(aPageData, aRequest, aRequest.status);

		aPageData.setValue("page", aRequest.item);
		aPageData.setValue("canRender", true);

		if(this.item.url === aPageData.url) {
			this.item.currentPage = aPageData;
			this.item.setValue("status", Dbm.loading.LoadingStatus.LOADED);

		}

		//METODO: remove updaters
		
	}
}