import Dbm from "../index.js";

export default class JsonLoader extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();
		
		this.item.setValue("url", null);
		this.item.setValue("method", "GET");
		this.item.setValue("mode", null);
		this.item.setValue("credentials", "same-origin");
		this.item.setValue("headers", {});
		
		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
        this.item.setValue("data", null);
        this.item.setValue("body", null);
	}
	
	get completed() {
		let status = this.item.status;
		return (status === Dbm.loading.LoadingStatus.LOADED || status === Dbm.loading.LoadingStatus.ERROR);
	}
	
	setMethod(aMethod) {
		this.item.method = aMethod;
		
		return this;
	}
	
	setUrl(aUrl) {
		this.item.url = aUrl;
		
		return this;
	}
	
	setupPost(aUrl, aBody) {
		this.item.url = aUrl;
		this.item.method = "POST";
		this.setBody(aBody);
		
		return this;
	}
	
	setupJsonPost(aUrl, aBody) {
		this.item.url = aUrl;
		
		return this.setJsonPostBody(aBody);
	}
	
	setJsonPostBody(aBody) {
		this.item.method = "POST";
		this.item.body = JSON.stringify(aBody);
		
		this.addHeader("Content-Type", "application/json");
		
		return this;
	}
	
	addHeader(aName, aValue) {
		this.item.headers[aName] = aValue;
		
		return this;
	}
	
	setBody(aBody) {
		this.item.body = (aBody instanceof String || aBody instanceof FormData) ? aBody : JSON.stringify(aBody);
		
		return this;
	}
	
	setData(aData) {
		//console.log("wprr/utils/loading/JsonLoader::setData");
		//console.log(aData);
		
		this._loadedAt = (new Date()).valueOf();
		this.item.data = aData;
	}
	
	setStatus(aStatus) {
		//console.log("wprr/utils/loading/JsonLoader::setStatus");
		//console.log(aStatus);
		
		this.item.status = aStatus;
		
		return this;
	}
	
	load() {
		
		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}
		
        this.item.status = Dbm.loading.LoadingStatus.LOADING;
		let sendParameters =  {"credentials": this.item.credentials, "method": this.item.method, headers: this.item.headers};
		if(this.item.mode) {
			sendParameters["mode"] = this.item.mode;
		}
		if(this.item.method !== "GET" && this.item.method !== "HEAD" && this.item.body) {
			sendParameters["body"] = this.item.body;
		}
		
		fetch(this.item.url, sendParameters)
		.then( (response) => {
			if(response.ok) {
				return response.json();
			}
			else {
				return response.text().then(function(aText) {
					throw(new Error("Server response: " + response.status + " " + response.statusText + " (" + response.type + "): " + aText));
				})
			}
		})
		.then( (data) => {
			this.setData(data);
			this.setStatus(Dbm.loading.LoadingStatus.LOADED);
		})
		.catch( (error) => {
			console.error("Error submitting");
			console.log(error);
			
			this.setStatus(Dbm.loading.LoadingStatus.ERROR);
		});
		
		return this;
	}
}