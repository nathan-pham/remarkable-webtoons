import { Remarkable } from "remarkable-typescript"
import { uuid } from "uuidv4"

import * as dotenv from "dotenv"
dotenv.config()

import * as fs from "fs"

import Webtoon from "./classes/Webtoon.js"

const main = (async () => {

    const client = new Remarkable({ deviceToken: `${process.env.DEVICE_TOKEN}` })
    await client.refreshToken()

    // const webtoon = new Webtoon({ name: "The Max Level Hero has Returned" })
    // const chapters = (await webtoon.fetchWebtoon(webtoon.createUrl(webtoon.name))).reverse()

    // const chapterUrl = chapters[0]
    // const images = await webtoon.fetchChapter(chapterUrl)

    // const pdfFilename = await webtoon.createPdf(chapterUrl, images)
    // console.log(pdfFilename)
    const pdfFilename = "./manga/the-max-level-hero-has-returned/1.pdf"
    const pdfBuffer = fs.readFileSync(pdfFilename)
    
    await client.uploadPDF(pdfFilename, uuid(), pdfBuffer)
    console.log("uploaded")

})()