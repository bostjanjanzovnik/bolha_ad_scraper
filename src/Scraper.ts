import puppeteer from "puppeteer"
import { Config } from "./config"

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

        // test
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(urls[0])

        if (page.url() === urls[0]) {
            const result = await page.$eval(".notification.notification--info p", el => el.innerHTML)

            console.log(result)
        }
    }
}
