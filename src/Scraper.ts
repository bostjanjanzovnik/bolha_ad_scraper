import puppeteer, { Page } from "puppeteer"
import { Config } from "./config"
import { Ad } from "./interfaces"

export class Scraper {
    readonly config

    constructor() {
        this.config = new Config()
    }

    async scrape(): Promise<void> {
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
        const adListItems = await page.$$(".EntityList--ListItemRegularAd>ul.EntityList-items>li.EntityList-item")

        return await adListItems.reduce(async (acc, adListItem) => {
            const accumulator = await acc

            try {
                const title = await adListItem.$eval("h3.entity-title>a", el => el.innerHTML)

                if (title) {
                    accumulator.push({ title: title.toString() })
                }
            } catch (e) {
                console.log("Could not get title")
            }

            return accumulator
        }, Promise.resolve([] as Ad[]))
    }
}
