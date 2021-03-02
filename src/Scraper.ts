import moment from "moment"
import puppeteer, { Page } from "puppeteer"
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
        const adListItems = await page.$$(".EntityList--ListItemRegularAd>ul.EntityList-items>li.EntityList-item--Regular")

        return await adListItems.reduce(async (acc, adListItem) => {
            const accumulator = await acc

            try {
                // id
                const adId = await adListItem.$eval("h3.entity-title>a", el => el.getAttribute("name"))

                // title
                const adTitle = await adListItem.$eval("h3.entity-title>a", el => el.innerHTML)

                // url
                const urlPath = await adListItem.$eval("h3.entity-title>a", el => el.getAttribute("href"))
                const adUrl = `${this.config.bolhaUrl}${urlPath}`

                // published date
                const adPublishedDateAttr = await adListItem.$eval("div.entity-pub-date>.date", el => el.getAttribute("datetime"))
                const adPublishedDate = adPublishedDateAttr ? moment(adPublishedDateAttr.toString()).format("DD.MM.YYYY HH:mm") : undefined

                // price
                const adPriceHtml = await adListItem.$eval("div.entity-prices .price", el => el.innerHTML)
                const adPriceMatch = adPriceHtml ? adPriceHtml.toString().match(/[0-9.,]+/) : undefined
                const adPrice = adPriceMatch?.length ? adPriceMatch[0] : undefined

                // currency
                const adPriceCurrency = await adListItem.$eval("div.entity-prices .currency", el => el.innerHTML)

                // description
                const adDescriptionHtml = await adListItem.$eval("div.entity-description>.entity-description-main", el => el.innerHTML)
                const adDescription = adDescriptionHtml
                    ? adDescriptionHtml
                          .toString()
                          .trim()
                          .replace(/<(.|\n)*?>/g, "")
                          .replace(/\s\s+/g, " ")
                    : undefined

                if (adId && adTitle && adUrl) {
                    accumulator.push({
                        id: adId.toString(),
                        title: adTitle.toString(),
                        url: adUrl.toString(),
                        publishedDate: adPublishedDate,
                        price: adPrice,
                        currency: adPriceCurrency.toString(),
                        description: adDescription,
                    })
                }
            } catch (e) {
                console.log("Could not get ad property", e)
            }

            return accumulator
        }, Promise.resolve([] as Ad[]))
    }
}
