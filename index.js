import ReMarkable from "remarkable-cloud-js"
import Webtoon from "./classes/Webtoon.js"

// const webtoon = new Webtoon({ name: "The Max Level Hero has Returned" })

const tablet = new ReMarkable()

tablet.register_device("", ReMarkable.device_desc.desktop.linux).then(console.log)

// let device_token = await rm_api.register_device('< one time code >', RmCJS.device_desc.desktop.linux)
