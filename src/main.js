import "./style.css"
import { CITIES, getCityForecast } from "./api.js"
import { render } from "./render.js"

const state = {
    items: [],
    status: "loading",
    error: null,
    query: "",
    filter: "all",
    sort: "default",
}

async function load() {
    state.status = "loading"
    render(state)
    try {
        const data = await getCityForecast(CITIES[0])
        state.items = [{ ...CITIES[0], daily: data.daily }]
        state.status = "success"
    } catch (err) {
        state.status = "error"
        state.error = err.message
    } finally {
        render(state)
    }
}

document.querySelector("#app").addEventListener("click", (event) => {
    if (event.target.closest('[data-action="retry"]')) load()
})

load()