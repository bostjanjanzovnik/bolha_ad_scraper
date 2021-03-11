import * as dotenv from "dotenv"

dotenv.config({ path: "./.env" })

import { Database } from "./Database"
import { Scraper } from "./Scraper"

const database = new Database()
const scraper = new Scraper(database)

scraper.scrapeUrls()
