import Dbm from "../../index.js";

export default class EmailMessage extends Dbm.core.BaseObject {

	_construct() {
		super._construct();

		this.item.requireProperty("from", null);
		this.item.requireProperty("to", null);
		this.item.requireProperty("subject", null);
		this.item.requireProperty("textContent", null);
		this.item.requireProperty("htmlContent", null);
	}

	setClient(aClientItem) {
		this.item.setValue("client", aClientItem);

		return this;
	}

	setFrom(aEmail) {
		this.item.from = aEmail;

		return this;
	}

	setTo(aEmail) {
		this.item.to = aEmail;

		return this;
	}

	setSubject(aText) {
		this.item.subject = aText;

		return this;
	}

	setHtmlContent(aText) {
		this.item.htmlContent = aText;

		return this;
	}

	setTextContent(aText) {
		this.item.textContent = aText;

		return this;
	}
	
	async send() {
        return this.item.client.controller.performSendMessage(this.item);
    }
}