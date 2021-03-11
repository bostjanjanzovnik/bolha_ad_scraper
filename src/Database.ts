import { connect } from "mongoose"
import { Config } from "./config"

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
}
