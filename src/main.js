import "./style.css"
import { getJSON } from "./api.js"

const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-1.9441&longitude=30.0619&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa%2FKigali"

async function test() {
    try {
        const data = await getJSON(url)
        console.log(data)
    } catch (err) {
        console.error("Failed:", err.message)
    }
}

test()