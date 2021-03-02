export class Config {
    readonly scrapeUrls: string[]
    readonly bolhaUrl: string

    constructor() {
        this.scrapeUrls = process.env.SCRAPE_URLS?.split(",") || []
        this.bolhaUrl = process.env.BOLHA_URL || ""
    }
}
