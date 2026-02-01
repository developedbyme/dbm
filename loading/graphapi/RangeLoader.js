import Dbm from "../../index.js";

export default class RangeLoader extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();

		this.item.setValue("request", null);
		
		this.item.setValue("selects", []);
		this.item.setValue("encodes", ["id"]);

		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);

		this.item.setValue("items", []);
	}
	
	get completed() {
		let status = this.item.status;
		return (status === Dbm.loading.LoadingStatus.LOADED || status === Dbm.loading.LoadingStatus.ERROR);
	}
	
	addSelect(aSelect) {
		this.item.addToArray("selects", aSelect);
		
		return this;
	}

	includePrivate() {
		this.addSelect({"type": "includePrivate"});

		return this;
	}

	includedraft() {
		this.addSelect({"type": "includeDraft"});

		return this;
	}

	addEncode(aEncode) {
		this.item.addToArray("encodes", aEncode);
		
		return this;
	}
	
	load() {

		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}
		
		let request = Dbm.getCachedGraphApi().requestRange(this.item.selects, this.item.encodes);

		this.item.request = request;

		this.item.properties.items.connectInput(request.items);
		this.item.properties.status.connectInput(request.status);
		
		return this;
	}
}