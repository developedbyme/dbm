import Dbm from "../index.js";

export default class JsonLoader extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();
		
		this.item.setValue("url", null);
		this.item.setValue("element", null);

		this.item.setValue("width", 0);
		this.item.setValue("height", 0);

		this._callback_loadedBound = this._callback_loaded.bind(this);
		this._callback_loadingErrorBound = this._callback_loadingError.bind(this);
		
		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
	}
	
	get completed() {
		let status = this.item.status;
		return (status === Dbm.loading.LoadingStatus.LOADED || status === Dbm.loading.LoadingStatus.ERROR);
	}
	
	setUrl(aUrl) {
		this.item.url = aUrl;
		
		return this;
	}

	_callback_loaded(aEvent) {
		console.log(aEvent, this.item.element);

		this.item.width = this.item.element.naturalWidth;
		this.item.height = this.item.element.naturalHeight;

		this.item.status = Dbm.loading.LoadingStatus.LOADED;
	}

	_callback_loadingError(aEvent) {
		console.log(aEvent);

		this.item.status = Dbm.loading.LoadingStatus.ERROR;
	}
	
	load() {
		
		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}

		let image = new Image();
		image.addEventListener("load", this._callback_loadedBound);
		image.addEventListener("error", this._callback_loadingErrorBound);

		this.item.element = image;

		this.item.status = Dbm.loading.LoadingStatus.LOADING;
		image.src = this.item.url;
		console.log(image);
		
		return this;
	}
}