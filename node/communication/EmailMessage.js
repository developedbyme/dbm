import Dbm from "../../index.js";

export default class EmailMessage extends Dbm.core.BaseObject {

	_construct() {
		super._construct();

		this.item.requireProperty("from", null);
		this.item.requireProperty("to", null);
		this.item.requireProperty("subject", null);
		this.item.requireProperty("textContent", null);
		this.item.requireProperty("htmlContent", null);
		this.item.requireProperty("additionalData", null);
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

		let serviceName = this.item.client.serviceName;

		let objectTypes = ["transactional-communication", "transactional-communication/email", "integration-response"];
		if(serviceName) {
			objectTypes.push("integration-response/" + serviceName);
		}

		let message = await Dbm.node.getDatabase().createObject("private", objectTypes);
		await message.updateField("to", this.item.to);
		await message.updateField("subject", this.item.subject);
		await message.updateField("htmlContent", this.item.htmlContent);
		await message.updateField("textContent", this.item.textContent);

		let sendResponse = await this.item.client.controller.performSendMessage(this.item);

		await message.updateField("reponse", sendResponse.response);
		await message.updateField("from", sendResponse.from);

		if(sendResponse.id) {
			await message.setIdentifier(sendResponse.id);
		}

		return message;
    }
}