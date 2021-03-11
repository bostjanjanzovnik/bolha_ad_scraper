import { connect } from "mongoose"
import { Config } from "./config"
import { Ad } from "./interfaces"
import { AdDocument, AdModel } from "./models/AdModel"

export class Database {
    private readonly config

    constructor() {
        this.config = new Config()

        this.connectToDb()
    }

    private connectToDb(): void {
        connect(this.config.mongoDbUri, {
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
        })
            .then(() => console.log("Connected to DB"))
            .catch(e => console.log("Error connecting to DB", e))
    }

    async saveAds(ads: Ad[]): Promise<AdDocument[]> {
        return Promise.all(ads.map(async ad => await this.saveAd(ad)))
    }

    async saveAd(ad: Ad): Promise<AdDocument> {
        const existingAd = await AdModel.findOne({ id: ad.id })

        if (existingAd) {
            return existingAd
        }

        return AdModel.create(ad)
    }
}
