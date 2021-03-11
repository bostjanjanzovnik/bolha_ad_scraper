export class Config {
    readonly scrapeUrls: string[]
    readonly bolhaUrl: string
    readonly mongoDbUri: string
    readonly selectorForNextPageUrl: string
    readonly selectorForAdListItems: string
    readonly selectorForAdId: string
    readonly selectorForAdTitle: string
    readonly selectorForAdUrl: string
    readonly selectorForAdPublishedDate: string
    readonly selectorForAdPrice: string
    readonly selectorForAdPriceCurrency: string
    readonly selectorForAdDescription: string

    constructor() {
        this.scrapeUrls = process.env.SCRAPE_URLS?.split(",") || []
        this.bolhaUrl = process.env.BOLHA_URL || ""
        this.mongoDbUri = process.env.MONGODB_URI || ""
        this.selectorForNextPageUrl = ".Pagination-item--next>button"
        this.selectorForAdListItems = "ul.EntityList-items>li.EntityList-item"
        this.selectorForAdId = "h3.entity-title>a"
        this.selectorForAdTitle = "h3.entity-title>a"
        this.selectorForAdUrl = "h3.entity-title>a"
        this.selectorForAdPublishedDate = "div.entity-pub-date>.date"
        this.selectorForAdPrice = "div.entity-prices .price"
        this.selectorForAdPriceCurrency = "div.entity-prices .currency"
        this.selectorForAdDescription = "div.entity-description>.entity-description-main"
    }
}
