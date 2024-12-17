import https from "node:https";
import http from "node:http";

import Dbm from "../../index.js";

export default class JsonLoader extends Dbm.core.BaseObject {

	_construct() {
		
		super._construct();
		
		this.item.setValue("url", null);
		this.item.setValue("method", "GET");
		this.item.setValue("headers", {});
		
		this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
        this.item.setValue("data", null);
        this.item.setValue("body", null);
		this.item.setValue("rawData", "");

		this._callback_requestBound = this._callback_request.bind(this);
		this._callback_dataBound = this._callback_data.bind(this);
		this._callback_errorBound = this._callback_error.bind(this);
		this._callback_endBound = this._callback_end.bind(this);
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
		this.item.body = (aBody instanceof String) ? aBody : JSON.stringify(aBody);
		
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

	_callback_request(aResponse) {
		console.log("_callback_request");
		aResponse.on("data", this._callback_dataBound);
		aResponse.on("end", this._callback_endBound);
	}

	_callback_data(aData) {
		console.log("_callback_data");
		this.item.rawData += aData;
	}

	_callback_error(aError) {
		console.log("_callback_error");
		console.error(aError.message);

		this.item.status = Dbm.loading.LoadingStatus.ERROR;
	}

	_callback_end() {
		console.log("_callback_end");
		console.log(this.item.rawData);
		this._setData(this.item.rawData);
	}

	_setData(aData) {
		this.item.data = aData;
	}
	
	load() {
		console.log("load");
		
		if(this.item.status !== Dbm.loading.LoadingStatus.NOT_STARTED) {
			return this;
		}

		let body = this.item.body;
		
        this.item.status = Dbm.loading.LoadingStatus.LOADING;
		let sendParameters =  {
			"method": this.item.method,
			"headers": {...this.item.headers}
		};

		if(body) {
			sendParameters.headers['Content-Length'] = body.length;
		}

		let url = this.item.url;
		
		let request;
		if(url.indexOf("https://") === 0) {
			request = https.request(url, sendParameters, this._callback_requestBound).on("error", this._callback_errorBound);
		}
		else {
			request = http.request(url, sendParameters, this._callback_requestBound).on("error", this._callback_errorBound);
		}

		if(body) {
			request.write(body);
		}
		request.end();
		
		return this;
	}
}