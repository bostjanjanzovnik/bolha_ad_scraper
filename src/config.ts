export class Config {
    readonly scrapeUrls: string[]

    constructor() {
        this.scrapeUrls = process.env.SCRAPE_URLS?.split(",") || []
    }
}
