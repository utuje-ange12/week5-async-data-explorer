import "./style.css"
import { CITIES, getAllForecasts } from "./api.js"
import { render } from "./render.js"
import { toForecastDays } from "./utils.js"

const state = {
    items: [],
    failed: [],
    status: "loading",
    error: null,
    query: "",
    filter: "all",
    sort: "default",
}

async function load() {
    state.status = "loading"
    state.failed = []
    render(state)
    try {
        const { loaded, failed } = await getAllForecasts(CITIES)
        if (loaded.length === 0) throw new Error("All requests failed")
        state.items = loaded.map(({ daily, ...city }) => ({
            ...city,
            days: toForecastDays(daily),
        }))
        state.failed = failed
        state.status = "success"
    } catch (err) {
        state.status = "error"
        state.error = err.message
    } finally {
        render(state)
    }
}

document.querySelector("#search").addEventListener("input", (event) => {
    state.query = event.target.value
    render(state)
})

document.querySelector("#filter").addEventListener("change", (event) => {
    state.filter = event.target.value
    render(state)
})

document.querySelector("#sort").addEventListener("change", (event) => {
    state.sort = event.target.value
    render(state)
})

document.querySelector("#app").addEventListener("click", (event) => {
    if (event.target.closest('[data-action="retry"]')) load()
})

load()