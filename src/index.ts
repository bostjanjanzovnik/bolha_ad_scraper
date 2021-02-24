import * as dotenv from "dotenv"

dotenv.config({ path: "./.env" })

import { Scraper } from "./Scraper"

const scraper = new Scraper()

scraper.scrape()
