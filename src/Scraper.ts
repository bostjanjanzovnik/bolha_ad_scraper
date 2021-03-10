import moment from "moment"
import puppeteer, { ElementHandle, Page } from "puppeteer"
import { Config } from "./config"
import { Ad } from "./interfaces"

export class Scraper {
    readonly config

    constructor() {
        this.config = new Config()
    }

    async scrapeUrls(): Promise<void> {
        const urls = this.config.scrapeUrls

        if (!urls.length) {
            return
        }

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        const ads = await urls.reduce(async (acc, url) => {
            const accumulator = await acc

            await page.goto(url)

            const pageAds = await this.getPageAds(page)

            if (pageAds.length) {
                pageAds.forEach(pageAd => accumulator.push(pageAd))
            }

            return accumulator
        }, Promise.resolve([] as Ad[]))

        console.log("ADS", ads)
    }

    private async getPageAds(page: Page): Promise<Ad[]> {
        const adListItems = await page.$$("ul.EntityList-items>li.EntityList-item")

        return await adListItems.reduce(async (acc, adListItem) => {
            const accumulator = await acc

            try {
                const adId = await Scraper.getAdId(adListItem)
                const adTitle = await Scraper.getAdTitle(adListItem)
                const adUrl = await this.getAdUrl(adListItem)

                if (adId && adTitle && adUrl) {
                    accumulator.push({
                        id: adId,
                        title: adTitle,
                        url: adUrl,
                        publishedDate: await Scraper.getAdPublishedDate(adListItem),
                        price: await Scraper.getAdPrice(adListItem),
                        currency: await Scraper.getAdPriceCurrency(adListItem),
                        description: await Scraper.getAdDescription(adListItem),
                    })
                }
            } catch (e) {
                console.log("Could not get ad property", e)
            }

            return accumulator
        }, Promise.resolve([] as Ad[]))

        // TODO: iterate through results pages
    }

    private static async getAdId(adListItem: ElementHandle): Promise<string | undefined> {
        const adId = await adListItem.$eval("h3.entity-title>a", el => el.getAttribute("name"))

        return adId ? adId.toString() : undefined
    }

    private static async getAdTitle(adListItem: ElementHandle): Promise<string | undefined> {
        const adTitle = await adListItem.$eval("h3.entity-title>a", el => el.innerHTML)

        return adTitle ? adTitle.toString() : undefined
    }

    private async getAdUrl(adListItem: ElementHandle): Promise<string | undefined> {
        const urlPath = await adListItem.$eval("h3.entity-title>a", el => el.getAttribute("href"))

        return urlPath ? `${this.config.bolhaUrl}${urlPath.toString()}` : undefined
    }

    private static async getAdPublishedDate(adListItem: ElementHandle): Promise<string | undefined> {
        const adPublishedDateAttr = await adListItem.$eval("div.entity-pub-date>.date", el => el.getAttribute("datetime"))

        return adPublishedDateAttr ? moment(adPublishedDateAttr.toString()).format("DD.MM.YYYY HH:mm") : undefined
    }

    private static async getAdPrice(adListItem: ElementHandle): Promise<string | undefined> {
        const adPriceHtml = await adListItem.$eval("div.entity-prices .price", el => el.innerHTML)
        const adPriceMatch = adPriceHtml ? adPriceHtml.toString().match(/[0-9.,]+/) : undefined

        return adPriceMatch?.length ? adPriceMatch[0] : undefined
    }

    private static async getAdPriceCurrency(adListItem: ElementHandle): Promise<string | undefined> {
        const adPriceCurrency = await adListItem.$eval("div.entity-prices .currency", el => el.innerHTML)

        return adPriceCurrency ? adPriceCurrency.toString() : undefined
    }

    private static async getAdDescription(adListItem: ElementHandle): Promise<string | undefined> {
        const adDescriptionHtml = await adListItem.$eval("div.entity-description>.entity-description-main", el => el.innerHTML)

        return adDescriptionHtml
            ? adDescriptionHtml
                  .toString()
                  .trim()
                  .replace(/<(.|\n)*?>/g, "")
                  .replace(/\s\s+/g, ", ")
            : undefined
    }
}
