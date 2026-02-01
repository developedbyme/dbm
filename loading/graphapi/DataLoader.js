import Dbm from "../../index.js";

export default class DataLoader extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();

		this.item.setValue("request", null);
		
		this.item.setValue("type", null);
		this.item.setValue("body", {});

		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);

		this.item.setValue("data", null);
	}
	
	get completed() {
		let status = this.item.status;
		return (status === Dbm.loading.LoadingStatus.LOADED || status === Dbm.loading.LoadingStatus.ERROR);
	}
	
	setType(aType) {
		this.item.type = aType;
		
		return this;
	}

	setBody(aBody) {
		this.item.body = aBody;
		
		return this;
	}
	
	load() {

		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}
		
		let request = Dbm.getCachedGraphApi().requestData(this.item.type, this.item.body);

		this.item.request = request;

		this.item.properties.data.connectInput(request.properties.data);
		this.item.properties.status.connectInput(request.properties.status);
		
		return this;
	}
}