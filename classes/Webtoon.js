import PDFDocument from "pdfkit"
import fetch from "node-fetch"
import jsdom from "jsdom"

import * as fs from "fs"

const { JSDOM } = jsdom

export default class Webtoon {

    
    chapters = []

    constructor(props) {

        this.main(props)

    }

    async main({ name }) {

        this.name = name
        this.url = this.createUrl(name)
        
        this.chapters = await this.fetchWebtoon(this.url)

        for(const chapter of this.chapters) {

            const pdfFilename = await this.fetchChapter(chapter)

        }

    }

    createUrl(name) {

        return `https://toonily.com/webtoon/${this.formatName(name)}`

    }
    
    formatName(name) {

        return name.toLowerCase().split(' ').join('-')

    }

    async fetchWebtoon(url) {

        const webtoonHtml = await fetch(url).then(res => res.text())
        const webtoonDocument = new JSDOM(webtoonHtml).window.document

        return [...webtoonDocument.querySelectorAll("li.wp-manga-chapter a")].map(chapter => chapter.href)

    }

    async fetchChapter(url) {

        const chapterHtml = await fetch(url).then(res => res.text())
        const chapterDocument = new JSDOM(chapterHtml).window.document

        const images = [...chapterDocument.querySelectorAll("img.wp-manga-chapter-img")].map(image => image.src)
        
        const filename = `/manga/${this.formatName(this.name)}/${url.split('-').pop()}.pdf`
        const pdfDocument = new PDFDocument()

        pdfDocument.pipe(fs.createWriteStream(filename))

        for(const image of images) {

            const imageBuffer = Buffer.from(await fetch(image.url).then(res => res.arrayBuffer()))
            pdfDocument.image(imageBuffer)
            
        }

        pdfDocument.end()

        return filename

    }

}