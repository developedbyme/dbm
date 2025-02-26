import Dbm from "../index.js";

export {default as SiteNavigation} from "./SiteNavigation.js";
export {default as SiteDataLoader} from "./SiteDataLoader.js";
export {default as BrowserUpdater} from "./BrowserUpdater.js";

export const setupAndStart = function(aTitleSuffix) {
    let siteNavigation = new Dbm.site.SiteNavigation();
    siteNavigation.item.register("siteNavigation");
    siteNavigation.start();
    siteNavigation.setUrlFromLocation();

    let siteDataLoader = new Dbm.site.SiteDataLoader();
    siteDataLoader.item.register("siteDataLoader");
    siteDataLoader.item.properties.url.connectInput(siteNavigation.item.properties.url);

    let browserUpdater = new Dbm.site.BrowserUpdater();
    siteDataLoader.item.register("site/browserUpdater");
    browserUpdater.setTitleSuffix(aTitleSuffix);
    browserUpdater.item.propertyInput("pageData", siteDataLoader.item.properties.currentPage);
}