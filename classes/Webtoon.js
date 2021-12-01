import PDFDocument from "pdfkit"
import fetch from "node-fetch"
import AdmZip from "adm-zip"
import jsdom from "jsdom"

import * as fs from "fs"

const { JSDOM } = jsdom

export default class Webtoon {

    constructor({ name }) {

        this.name = name

    }

    // async main({ name }) {
        
    //     this.chapters = await this.fetchWebtoon(this.url)

    //     for(const chapter of this.chapters) {

    //         const pdfFilename = await this.fetchChapter(chapter)

    //     }

    // }

    createUrl(name) {

        return `https://toonily.com/webtoon/${this.formatName(name)}`

    }

    createId() {

        return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)

    }
    
    formatName(name) {

        return name.toLowerCase().split(' ').join('-')

    }

    async fetchWebtoon(url) {

        const webtoonHtml = await fetch(url).then(res => res.text())
        const webtoonDocument = new JSDOM(webtoonHtml).window.document

        return [...webtoonDocument.querySelectorAll("li.wp-manga-chapter a")].map(chapter => chapter.href)

    }

    async fetchChapter(chapterUrl) {

        const chapterHtml = await fetch(chapterUrl).then(res => res.text())
        const chapterDocument = new JSDOM(chapterHtml).window.document

        const images = [...chapterDocument.querySelectorAll("img.wp-manga-chapter-img")].map(image => image.dataset.src.trim())
        return images

    }

    async downloadImage(mangaDir, imageUrl) {

        const imageFilename = `${mangaDir}/${this.createId()}.temp.${imageUrl.split('.').pop()}`

        return new Promise(async (resolve, reject) => {

            await fetch(imageUrl, {
                method: 'GET',
                headers: {
                    "Origin": "https://toonily.com",
                    "Referer": "https://toonily.com/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
                }
            }).then(res => {

                const imageStream = fs.createWriteStream(imageFilename)

                res.body.pipe(imageStream)
                res.body.on("end", () => resolve(imageFilename))

                imageStream.on("error", () => reject("[Webtoon.js] failed to download image"))

            })

        })
        
    }

    async createPdf(chapterUrl, imageUrls) {

        const mangaDir = `./manga/${this.formatName(this.name)}`
        const filename = `${mangaDir}/${parseInt(chapterUrl.split('-').pop())}.pdf`

        if(!fs.existsSync(mangaDir)) fs.mkdirSync(mangaDir)

        const pdfDocument = new PDFDocument()

        pdfDocument.pipe(fs.createWriteStream(filename))

        for(const imageUrl of imageUrls) {
            
            const imageFilename = await this.downloadImage(mangaDir, imageUrl)
            const pdfImage = pdfDocument.openImage(imageFilename)

            console.log("downloaded", imageUrl)

            pdfDocument.addPage({ size: [ pdfImage.width, pdfImage.height]  })
            pdfDocument.image(pdfImage, 0, 0)

            fs.unlinkSync(imageFilename)

            // console.log("removed", imageFilename)

        }

        pdfDocument.end()

        return filename

    }

    zipPdf(pdfFilename) {

        const compressedFile = new AdmZip()
        compressedFile.addLocalFile(pdfFilename, "", "pdf")
        return compressedFile.toBuffer()

    }

}