import moment from "moment"
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer"
import { Config } from "./config"
import { Database } from "./Database"
import { Ad } from "./interfaces"

export class Scraper {
    private readonly config
    // @ts-ignore
    private database: Database

    constructor(database: Database) {
        this.config = new Config()
        this.database = database
    }

    async scrapeUrls(): Promise<void> {
        const urls = this.config.scrapeUrls

        if (!urls.length) {
            return
        }

        const browser = await puppeteer.launch()
        const ads: Ad[] = []

        await Promise.all(urls.map(async url => await this.iteratePages(browser, url, ads)))

        console.log("ADS", ads.length)
    }

    private async iteratePages(browser: Browser, url: string, ads: Ad[]): Promise<void> {
        const page = await browser.newPage()

        await Promise.all([page.goto(url), page.waitForNavigation({ waitUntil: "networkidle2" })])

        let pageAds: Ad[] = []

        try {
            pageAds = await this.getPageAds(page)
        } catch (e) {
            console.log("Could not get page ads", e)
        }

        pageAds.forEach(ad => ads.push(ad))

        console.log("URL", url, pageAds.length)

        try {
            const nextPageUrl = await this.getNextPageUrl(page)

            if (nextPageUrl) {
                await this.iteratePages(browser, nextPageUrl, ads)
            }
        } catch (e) {
            console.log("Page iteration done")
        }
    }

    private async getPageAds(page: Page): Promise<Ad[]> {
        const adListItems = await this.getAdListItems(page)

        return await adListItems.reduce(async (acc, adListItem) => {
            const accumulator = await acc

            try {
                const adId = await this.getAdId(adListItem)
                const adTitle = await this.getAdTitle(adListItem)
                const adUrl = await this.getAdUrl(adListItem)

                if (adId && adTitle && adUrl) {
                    accumulator.push({
                        id: adId,
                        title: adTitle,
                        url: adUrl,
                        publishedDate: await this.getAdPublishedDate(adListItem),
                        price: await this.getAdPrice(adListItem),
                        currency: await this.getAdPriceCurrency(adListItem),
                        description: await this.getAdDescription(adListItem),
                    })
                }
            } catch (e) {
                console.log("Could not get ad property", e)
            }

            return accumulator
        }, Promise.resolve([] as Ad[]))
    }

    private async getNextPageUrl(page: Page): Promise<string | undefined> {
        const nextPageUrl = await page.$eval(this.config.selectorForNextPageUrl, el => el.getAttribute("data-href"))

        return nextPageUrl ? nextPageUrl.toString() : undefined
    }

    private async getAdListItems(page: Page): Promise<ElementHandle[]> {
        return page.$$(this.config.selectorForAdListItems)
    }

    private async getAdId(adListItem: ElementHandle): Promise<string | undefined> {
        const adId = await adListItem.$eval(this.config.selectorForAdId, el => el.getAttribute("name"))

        return adId ? adId.toString() : undefined
    }

    private async getAdTitle(adListItem: ElementHandle): Promise<string | undefined> {
        const adTitle = await adListItem.$eval(this.config.selectorForAdTitle, el => el.innerHTML)

        return adTitle ? adTitle.toString() : undefined
    }

    private async getAdUrl(adListItem: ElementHandle): Promise<string | undefined> {
        const urlPath = await adListItem.$eval(this.config.selectorForAdUrl, el => el.getAttribute("href"))

        return urlPath ? `${this.config.bolhaUrl}${urlPath.toString()}` : undefined
    }

    private async getAdPublishedDate(adListItem: ElementHandle): Promise<string | undefined> {
        const adPublishedDateAttr = await adListItem.$eval(this.config.selectorForAdPublishedDate, el => el.getAttribute("datetime"))

        return adPublishedDateAttr ? moment(adPublishedDateAttr.toString()).format("DD.MM.YYYY HH:mm") : undefined
    }

    private async getAdPrice(adListItem: ElementHandle): Promise<string | undefined> {
        const adPriceHtml = await adListItem.$eval(this.config.selectorForAdPrice, el => el.innerHTML)
        const adPriceMatch = adPriceHtml ? adPriceHtml.toString().match(/[0-9.,]+/) : undefined

        return adPriceMatch?.length ? adPriceMatch[0] : undefined
    }

    private async getAdPriceCurrency(adListItem: ElementHandle): Promise<string | undefined> {
        const adPriceCurrency = await adListItem.$eval(this.config.selectorForAdPriceCurrency, el => el.innerHTML)

        return adPriceCurrency ? adPriceCurrency.toString() : undefined
    }

    private async getAdDescription(adListItem: ElementHandle): Promise<string | undefined> {
        const adDescriptionHtml = await adListItem.$eval(this.config.selectorForAdDescription, el => el.innerHTML)

        return adDescriptionHtml
            ? adDescriptionHtml
                  .toString()
                  .trim()
                  .replace(/<(.|\n)*?>/g, "")
                  .replace(/\s\s+/g, ", ")
            : undefined
    }
}
