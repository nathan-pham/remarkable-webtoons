export default class Webtoon {

    BASE_API = "https://toonily.com/webtoon"

    constructor({ url }) {

        this.url = `${this.BASE_API}/${url.toLowerCase().split(' ').join('-')}`

    }

}