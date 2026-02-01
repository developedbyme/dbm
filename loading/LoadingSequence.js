import Dbm from "../index.js";

export default class LoadingSequence extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();
		
		this.item.setValue("waitingLoaders", []);
		this.item.setValue("loaders", []);
		this.item.setValue("currentLoader", null);
		
		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
	}
	
	get completed() {
		let status = this.item.status;
		return (status === Dbm.loading.LoadingStatus.LOADED || status === Dbm.loading.LoadingStatus.ERROR);
	}
	
	addLoader(aLoader) {
		this.item.addToArray("waitingLoaders", aLoader);
		this.item.addToArray("loaders", aLoader);

		if(this.item.status === Dbm.loading.LoadingStatus.LOADED) {
			this._loadNextLoader();
		}
		
		return this;
	}
	
	load() {
		console.log("load");

		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}

		this._loadNextLoader();
		
		return this;
	}

	_loadNextLoader() {
		console.log("_loadNextLoader");

		if(this.item.waitingLoaders.length > 0) {
			let nextLoader = this.item.waitingLoaders[0];
			this.item.removeFromArray("waitingLoaders", nextLoader);
			this.item.currentLoader = nextLoader;

			this.item.status = Dbm.loading.LoadingStatus.LOADING;

			Dbm.flow.runWhenMatched(nextLoader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaderLoaded.bind(this), [nextLoader]));
			nextLoader.load();
			
		}
		else {
			this.item.status = Dbm.loading.LoadingStatus.LOADED;
		}
	}

	_loaderLoaded(aLoader) {
		if(this.item.currentLoader === aLoader) {
			this.item.currentLoader = null;
			this._loadNextLoader();
		}
	}
}