import { Remarkable } from "remarkable-typescript"
import * as dotenv from "dotenv"
import * as fs from "fs"

import Webtoon from "./classes/Webtoon.js"

dotenv.config()

// const webtoon = new Webtoon({ name: "The Max Level Hero has Returned" })

const main = (async () => {

    const client = new Remarkable({ deviceToken: `${process.env.DEVICE_TOKEN}` })
    await client.refreshToken()

    const webtoon = new Webtoon({ name: "The Max Level Hero has Returned" })
    // const chapters = (await webtoon.fetchWebtoon(webtoon.createUrl(webtoon.name))).reverse()

    // const chapterUrl = chapters[0]
    // const images = await webtoon.fetchChapter(chapterUrl)

    // const pdfFilename = await webtoon.createPdf(chapterUrl, images)
    // console.log(pdfFilename)
    const pdfFilename = "./manga/the-max-level-hero-has-returned/1.pdf"
    const zipBuffer = webtoon.zipPdf(pdfFilename)

    await client.uploadZip('My document name', zipBuffer);
    // await client.uploadPDF("bruh.pdf", fs.readFileSync())
    // console.log("successfully uploaded!")
    // const pdfUploadedId = await client.uploadPDF('name of PDF document', ID: '181a124b-bbdf-4fdd-8310-64fa87bc9c7f', pdfFileBuffer, /*optional UUID of parent folder*/);


})()

// let device_token = await rm_api.register_device('< one time code >', RmCJS.device_desc.desktop.linux)
