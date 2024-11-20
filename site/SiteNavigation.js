import Dbm from "../index.js";

export default class SiteNavigation extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("url", null);
        this.item.setValue("active", false);

        this.item.setValue("travelPaths", []);
        this.item.setValue("navigationLocks", []);

        this.item.setValue("allowedPaths", [
            new RegExp(".*")
        ]);
		
		this.item.setValue("ignoredPaths", [
			new RegExp("/assets/.*$"),
			new RegExp("/api/.*$")
		]);

        this._callback_beforeUnloadBound = this._callback_beforeUnload.bind(this);
        this._callback_clickBound = this._callback_click.bind(this);
        this._callback_popStateBound = this._callback_popState.bind(this);
    }

    start() {
        this._performStart();
        this.item.active = true;

        return this;
    }

    _performStart() {
        window.addEventListener("beforeunload", this._callback_beforeUnloadBound, true);
        window.addEventListener("click", this._callback_clickBound, false);
        window.addEventListener("popstate", this._callback_popStateBound, false);
    }

    stop() {
        this._performStop();
        this.item.active = false;

        return this;
    }

    _performStop() {
        window.removeEventListener("beforeunload", this._callback_beforeUnloadBound, true);
        window.removeEventListener("click", this._callback_clickBound, false);
        window.removeEventListener("popstate", this._callback_popStateBound, false);
    }

    _callback_beforeUnload(aEvent) {
        //METODO
        let isLocked = this.hasNavigationLock();
		
		if(isLocked) {
			aEvent.preventDefault();
			aEvent.returnValue = "";
		
			return true;
		}
		
		return false;
    }

    _shouldHandle(aLink) {
		let shouldHandle = false
		{
			let currentArray = this.item.allowedPaths;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentIgnoredPattern = currentArray[i];
				if(currentIgnoredPattern.test(aLink)) {
					shouldHandle = true;
					break;
				}
			}
		}
		
		if(!shouldHandle) {
			return false;
		}
		
		{
			let currentArray = this.item.ignoredPaths;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentIgnoredPattern = currentArray[i];
				if(currentIgnoredPattern.test(aLink)) {
					return false;
				}
			}
		}
		
		
		return true;
	}

    _hasSpecialKey(aEvent) {
		return aEvent.altKey || aEvent.ctrlKey || aEvent.metaKey || aEvent.shiftKey;
	}

    _callback_click(aEvent) {
        if(aEvent.defaultPrevented) {
			return true;
		}
		if(this._hasSpecialKey(aEvent)) {
			return true;
		}
		
		let link = null;
		let currentNode = aEvent.target;
		let debugCounter = 0;
		while(currentNode) {
			if(debugCounter++ > 10000) {
				console.error("Loop has run for too long");
				break;
			}
			if(currentNode.localName === "a") {
				let hrefAttribute = currentNode.getAttribute("href");
				if(hrefAttribute) {
					link = hrefAttribute.toString();
					let hardNavigation = currentNode.getAttribute("data-not-spa-link");
					if(hardNavigation) {
						return true;
					}
					break;
				}
			}
			currentNode = currentNode.parentNode;
		}
		
		if(!link) {
			return true;
		}
		
		let originalUrl = new URL(document.location.href);
		let finalUrl = new URL(link, document.location.href);
		
		if(originalUrl.hostname !== finalUrl.hostname) {
			return true;
		}
		
		if(!this._shouldHandle(finalUrl.href)) {
			return false;
		}
		
		//console.log(finalUrl);
		
		aEvent.preventDefault();
		
		this._internalNavigation(finalUrl.href);
		window.scrollTo(0, 0);
		
		return false;
    }

    _addUrlToPath(aUrl) {
		let paths = [].concat(this.item.travelPaths);
			
		paths.push(aUrl);
		
		this.item.travelPaths = paths;
	}
	
	_trackPage(aUrl) {
		//console.log("_trackPage");
		
		let trackingController = Dbm.getInstance().repository.getItem("trackingController").controller;
		if(trackingController) {
			trackingController.trackPage(aUrl);
		}
	}

    _internalNavigation(aUrl) {
		
		let locks = this.getLockedNavigationLocks();
		if(locks.length > 0) {
			if(!confirm("Leave without saving changes?")) {
				return;
			}
		}
		
		history.pushState({}, "Page", aUrl);
		this.item.url = aUrl;
		
		this._trackPage(aUrl);
		
		this._addUrlToPath(aUrl);
	}

    _callback_popState(aEvent) {
		//console.log("_callback_popState");
		
		let url = document.location.href;
		this.item.url = url;
		
		this._trackPage(url);
		
		let paths = [].concat(this.item.travelPaths);
		paths.pop();
		this.item.travelPaths = paths;
	}

    navigate(aUrl) {
        let originalUrl = new URL(document.location.href);
		let finalUrl = new URL(aUrl, document.location.href);
		
		if(this.item.active && originalUrl.hostname === finalUrl.hostname && this._shouldHandle(finalUrl.href)) {
			this._internalNavigation(finalUrl.href);
			window.scrollTo(0, 0);
		}
		else {
			document.location.href = aUrl;
		}
    }

    setUrlFromLocation() {
		let url = document.location.href;
		this.item.url = url
		
		this._addUrlToPath(url);
		
		return this;
	}

    getLockedNavigationLocks() {
		let locks = this.item.navigationLocks;
		
		let lockedLocks = locks; //METODO: filter by locked locks
		
		return lockedLocks;
	}

	hasNavigationLock() {
		
		let locks = this.getLockedNavigationLocks();
		
		return (locks.length > 0);
	}
}