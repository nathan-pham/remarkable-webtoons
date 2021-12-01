import Webtoon from "./classes/Webtoon"

class App {

    constructor() {

        this.webtoon = new Webtoon({ url: "The Max Level Hero has Returned" })

    }

}

const app = new App()