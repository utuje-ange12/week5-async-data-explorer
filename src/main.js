import "./style.css"
import { CITIES, getCityForecast } from "./api.js"

const state = {
    items: [],
    status: "loading", // "loading" | "success" | "error"
    error: null,
    query: "",
    filter: "all",
    sort: "default",
}

async function load() {
    state.status = "loading"
    render()
    try {
        const data = await getCityForecast(CITIES[0])
        state.items = [{ ...CITIES[0], daily: data.daily }]
        state.status = "success"
    } catch (err) {
        state.status = "error"
        state.error = err.message
    } finally {
        render()
    }
}

function render() {
    console.log("render:", state.status, state)
}

load()